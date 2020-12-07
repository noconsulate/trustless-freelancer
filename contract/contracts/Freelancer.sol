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
        bool isReceived;
        uint256 startTime;
        uint256 endTime;
        uint256 daysRecurring; // to be multiplied by days
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
        uint256 _daysRecurring
    ) external returns (bool) {
        Escrow storage escrow = escrows[address(msg.sender)];
        // reject transfer from address already associated with escrow
        require(escrow.balance == 0, "this address already has an escrow");

        bool sent = token.transferFrom(msg.sender, address(this), _value);
        require(sent, "transfer failed");

        escrow.balance = _value;
        escrow.clientName = _clientName;
        escrow.startTime = now;
        escrow.endTime = escrow.startTime + _termTime * 1 days;
        escrow.daysRecurring = _daysRecurring;
        clients.push(msg.sender);

        emit Deposit(msg.sender, _value);
        return sent;
    }

    function _transfer(address receiver, uint256 value) internal {
        bool sent = token.transfer(receiver, value);

        require(sent, "didn't send");
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

        /// transfer to owner/merchant
        bool sent = token.transfer(address(owner), ownerValue);
        require(sent, "token transfer failed");
        emit Disperse(_receiver, escrow.balance);
        delete escrows[_client];
        _cleanup(_client);

        // credit service provider
        providerBalance += payeeValue;

        return sent;
    }

    //interface should check onlyOwner?
    function markShipped(address _client) public onlyOwner returns (bool sent) {
        Escrow storage escrow = escrows[_client];
        require(escrow.balance > 0, "this escrow is empty!");
        escrow.isShipped = true;

        if (escrow.isReceived) {
            bool sent = _disperse(_client, _client);
            return sent;
        }
    }

    function markReceived() public returns (bool sent) {
        Escrow storage escrow = escrows[msg.sender];
        require(escrow.balance > 0, "this escrow is empty!");
        escrow.isReceived = true;

        if (escrow.isShipped == true) {
            address owner = owner();
            bool sent = _disperse(msg.sender, owner);
            return sent;
        }
    }

    // ignores shipped/received status and only checks timestamps. this allows dispersal without user interaction perse.
    function triggerDisperse(address _client) public returns (bool sent) {
        Escrow storage escrow = escrows[_client];

        require(now > escrow.endTime, "end time not yet attained");
        address owner = owner();
        bool sent = _disperse(_client, owner);

        require(sent, "transfer failed");
        emit Disperse(msg.sender, escrow.balance);
        delete escrows[_client];
        _cleanup(_client);

        return sent;
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
            // payable(owner).transfer(escrows[clients[i - 1]].balance);
            // _transfer(owner, escrows[clients[i - 1]].balance);
            // token.transfer(address(owner), escrows[clients[i-1]].balance);
            delete escrows[clients[i - 1]];
            delete clients[i - 1];
        }

        uint256 balance = token.balanceOf(address(this));
        token.transfer(address(owner), balance);
        delete clients;
    }

    // is this effecient?
    function _cleanup(address _client) private {
        uint256 length = clients.length;
        uint256 indexToDelete;

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
            bool isReceived,
            uint256 startTime,
            uint256 endTime
        )
    {
        Escrow memory escrow = escrows[_escrow];
        return (
            escrow.clientName,
            escrow.balance,
            escrow.isShipped,
            escrow.isReceived,
            escrow.startTime * 1000,
            escrow.endTime * 1000
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
