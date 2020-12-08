import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
    using SafeMath for uint256;

    // for test/dev purposes, don't forget to delete
    function setEndTime(address _client) public {
        Escrow storage escrow = escrows[address(_client)];

        escrow.endTime = now;
    }

    struct Escrow {
        //   address payable merchant;
        uint256 balance;
        string clientName;
        bool isShipped;
        uint256 startTime;
        uint256 endTime;
        uint256 term;
        bool recurring; // to be multiplied by days
    }

    mapping(address => Escrow) escrows;
    // mapping(address => address) clientLookup;
    address[] public clients;

    string contractName;
    ERC20 public token;

    // Customizable fee to give to Trustless, expressed as 1/100 a percent. (ie UINT 150 == 1.5%)
    uint256 serviceFee;
    address serviceFeePayee = address(
        0x935A3dE3217D9BB58C24343600f655141d118aeB
    );
    uint256 providerBalance;

    event Deposit(address indexed _client, uint256 _value);
    event Refund(address indexed _client, uint256 _value);
    event Disperse(address indexed _client, uint256 _value);

    constructor(
        address _newOwner,
        string memory _contractName,
        address _tokenAddress,
        uint256 _serviceFee
    ) public {
        transferOwnership(_newOwner);
        contractName = _contractName;
        token = ERC20(_tokenAddress);
        serviceFee = _serviceFee;
    }

    function sendToken(
        uint256 _value,
        string memory _clientName,
        uint256 _termTime,
        bool _recurring
    ) external returns (bool) {
        Escrow storage escrow = escrows[address(msg.sender)];
        // reject transfer from address already associated with escrow
        require(escrow.balance == 0, "this address already has an escrow");

        bool sent = token.transferFrom(msg.sender, address(this), _value);
        require(sent, "transfer failed");

        escrow.balance = _value;
        escrow.clientName = _clientName;
        escrow.startTime = now;
        // should endTime be stored or calculated when needed?
        escrow.endTime = escrow.startTime + _termTime * 1 days;
        escrow.term = _termTime * 1 days;
        escrow.recurring = _recurring;
        clients.push(msg.sender);

        emit Deposit(msg.sender, _value);
        return sent;
    }

    function _disperse(address _client, address _receiver)
        internal
        returns (bool)
    {
        Escrow storage escrow = escrows[_client];
        address owner = owner();

        //assign proper values to owner and serviceFeePayee
        uint256 payeeValue = escrow.balance.div(serviceFee);
        uint256 ownerValue = escrow.balance.sub(payeeValue);
        // credit service provider
        providerBalance += payeeValue;

        // transfer to owner/merchant
        bool sent = token.transfer(address(owner), ownerValue);
        require(sent, "token transfer failed");
        emit Disperse(_receiver, escrow.balance);

        // if recurring then recur!
        if (escrow.recurring == false) {
            delete escrows[_client];
            _cleanup(_client);
        }
        // reset timestamps
        if (escrow.recurring = true) {
            require(sent, "re-upping the balance failed");
            escrow.startTime = escrow.endTime;
            escrow.endTime = escrow.startTime + escrow.term;
        }
        return sent;
    }

    function renewEscrow(address _client) public {
        Escrow storage escrow = escrows[_client];

        // check we are in the new term
        require(now >= escrow.startTime, "new term hasn't arrived yet");

        // if escrow wasn't marked shipped thus hasn't dispersed, disperse now
        if (!escrow.isShipped) {
            address owner = owner();
            bool dispersed = _disperse(_client, owner);
        }

        bool transferred = token.transferFrom(
            _client,
            address(this),
            escrow.balance
        );

        require(transferred, "transfer from client failed!");
        escrow.isShipped = false;
    }

    //interface should check onlyOwner?
    function markShipped(address _client) public onlyOwner {
        Escrow storage escrow = escrows[_client];
        require(
            escrow.balance > 0 || !escrow.isShipped,
            "this escrow is empty or has already been mark shipped!"
        );
        escrow.isShipped = true;

        address owner = owner();
        bool success = _disperse(_client, owner);
        require(success, "dispersal failed");
    }

    // ignores shipped/received status and only checks timestamps. this allows dispersal without user interaction perse.
    function triggerDisperse(address _client) public {
        Escrow storage escrow = escrows[_client];

        require(now > escrow.endTime, "end time not yet attained");
        require(
            !escrow.isShipped,
            "product already shipped, thus payment already dispersed"
        );
        address owner = owner();
        bool sent = _disperse(_client, owner);

        require(sent, "transfer failed");
    }

    function refund(address _client) public onlyOwner {
        Escrow storage escrow = escrows[_client];
        require(escrow.balance > 0, "this escrow is empty!");

        bool sent = token.transfer(address(_client), escrow.balance);

        require(sent, "transfer failed");
        emit Refund(_client, escrow.balance);
        delete escrows[_client];
        _cleanup(_client);
    }

    function reset() public onlyOwner {
        address owner = owner();
        uint256 length = clients.length;

        for (uint256 i = length; i > 0; i--) {
            bool sent = token.transfer(
                address(owner),
                escrows[clients[i - 1]].balance
            );

            require(sent, "failed to transfer tokens");
            delete escrows[clients[i - 1]];
            delete clients[i - 1];
        }

        uint256 balance = token.balanceOf(address(this));
        uint256 resetPayout = balance.sub(providerBalance);

        token.transfer(address(owner), resetPayout);
        delete clients;
    }

    // is this effecient?
    function _cleanup(address _client) private {
        uint256 length = clients.length;
        uint256 indexToDelete;

        // remove client from clients[]
        for (uint256 i = 0; i < length; i++) {
            if (clients[i] == _client) {
                indexToDelete = i;
            }
        }

        // if indexToDelete is not last in array, swap position
        if (indexToDelete < length - 1) {
            clients[indexToDelete] = clients[length - 1];
        }
        // remove last element
        delete clients[length - 1];
    }

    function getEscrowValues(address _escrow)
        public
        view
        returns (
            string memory name,
            uint256 balance,
            bool isShipped,
            uint256 startTime,
            uint256 endTime,
            uint256 term,
            bool recurring
        )
    {
        Escrow memory escrow = escrows[_escrow];
        return (
            escrow.clientName,
            escrow.balance,
            escrow.isShipped,
            // these three calculations should be made by the client not in the expensive EVM. or does it matter? this is view. if pure it matters. what's the advantage of view vs pure anyway?
            escrow.startTime * 1000,
            escrow.endTime * 1000,
            escrow.term * 1000,
            escrow.recurring
        );
    }

    function getClients() public view returns (address[] memory) {
        return clients;
    }

    function getName() public view returns (string memory) {
        return contractName;
    }

    // mark for deletion, already in Ownable.sol
    // function getOwner() public view returns (address) {
    //     address owner = owner();
    //     return owner;
    // }

    function total() public view returns (uint256) {
        uint256 balance = token.balanceOf(address(this));
        return balance;
    }

    function getServiceFee()
        public
        view
        returns (uint256 fee, uint256 balance)
    {
        return (serviceFee, providerBalance);
    }
}
