// to distribute service fees to proper parties
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ServiceFeeReceiver {
    ERC20 private token = ERC20(0xDdbfd4Bb2CFFfe0BEe18C5F11eDc22eFe6237266);

    // receiving parties given in percentage * 10
    address[] parties;
    mapping(address => uint256) stakes;

    constructor() public {
        parties.push(address(0x935A3dE3217D9BB58C24343600f655141d118aeB));
        stakes[address(0x935A3dE3217D9BB58C24343600f655141d118aeB)] = 10;
    }

    function payout() public returns (bool) {
        uint256 balance = token.balanceOf(address(this));
        uint256 cut0 = balance * (stakes[parties[0]] / 10);

        bool sent = token.transfer(parties[0], cut0);

        require(sent, "transfer failed");
        return sent;
    }

    function acceptPayment() public {}
}
