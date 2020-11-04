import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

pragma solidity ^0.6.12;

contract Freelancer is Ownable {
    struct Escrow {
        //   address payable merchant;
        uint256 balance;
        bool isShipped;
        bool isReceived;
    }

    mapping(address => Escrow) escrows;
    // mapping(address => address) clientLookup;
    address[] public clients;

    event Deposit(address indexed _client, uint256 _value);
    event Refund(address indexed _client, uint256 _value);
    event Disperse(address indexed _client, uint256 _value);

    IERC20 public token;

    constructor(address _newOwner, address _tokenAddress) public {
        transferOwnership(_newOwner);
        token = IERC20(_tokenAddress);
    }

    function sendToken(uint256 _value) external returns (bool) {
        Escrow storage escrow = escrows[address(msg.sender)];
        // reject transfer from address already associated with escrow
        require(escrow.balance == 0, "this address already has an escrow");

        bool sent = token.transferFrom(msg.sender, address(this), _value);
        require(sent, "transfer failed");

        escrow.balance = _value;
        clients.push(msg.sender);

        emit Deposit(msg.sender, _value);
        return sent
    }

    //interface should check onlyOwner?
    function markShipped(address _client) public onlyOwner {
        Escrow storage escrow = escrows[_client];
        require(escrow.balance > 0, "this escrow is empty!");
        escrow.isShipped = true;

        if (escrow.isReceived == true) {
            address owner = owner();
            // payable(owner).transfer(escrow.balance);

            bool sent = token.transfer(owner, escrow.balance); 
            require(sent, "transfer failed");

            emit Disperse(_client, escrow.balance);
            delete escrows[_client];
            _cleanup(_client);
        }
    }

    function markReceived() public {
        Escrow storage escrow = escrows[msg.sender];
        require(escrow.balance > 0, "this escrow is empty!");
        escrow.isReceived = true;

        if (escrow.isShipped == true) {
            address owner = owner();
            // payable(owner).transfer(escrow.balance);
            bool sent = token.transfer(owner, escrow.balance); 
            require(sent, "transfer failed");

            emit Disperse(msg.sender, escrow.balance);
            delete escrows[msg.sender];
            _cleanup(msg.sender);
        }
    }

    function refund(address _client) public onlyOwner {
        Escrow storage escrow = escrows[_client];
        require(escrow.balance > 0, "this escrow is empty!");

        payable(_client).transfer(escrow.balance);
        // verify transfer somehow? probably not.
        emit Refund(_client, escrow.balance);

        delete escrows[_client];
        _cleanup(_client);
    }

    function reset() public onlyOwner {
        address owner = owner();
        uint256 length = clients.length;

        for (uint256 i = length; i > 0; i--) {
            payable(owner).transfer(escrows[clients[i - 1]].balance);
            delete escrows[clients[i - 1]];
            // delete clients[i - 1];
        }
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
            uint256,
            bool,
            bool
        )
    {
        Escrow memory escrow = escrows[_escrow];
        return (escrow.balance, escrow.isShipped, escrow.isReceived);
    }

    function getClients() public view returns (address[] memory) {
        return clients;
    }

    function getOwner() public view returns (address) {
        address owner = owner();
        return owner;
    }
}
