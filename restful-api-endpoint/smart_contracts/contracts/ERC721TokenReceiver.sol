pragma solidity ^0.4.24;

interface ERC721TokenReceiver {
  function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) external returns(bytes4);
}

contract ERC721TokenRec is ERC721TokenReceiver {
  bytes4 internal constant ERC721_RECEIVED = 0x150b7a02;

  function onERC721Received(address, address, uint256, bytes) external returns(bytes4){
    return ERC721_RECEIVED;
  }
}
