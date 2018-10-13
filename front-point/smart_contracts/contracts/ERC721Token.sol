pragma solidity ^0.4.24;

import './ERC721.sol';

interface ERC721TokenReceiver {
  function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) external returns(bytes4);
}

contract ERC721Token is ERC721 {

    mapping(uint256 => address) tokenToOwner;
    mapping(address => uint256) ownerToBalance;
    mapping(uint256 => address) tokenToApproved;
    mapping(address => mapping(address => bool)) ownerToOperator;

    modifier hasPermission(address _caller, uint256 _tokenId) {
        require(_caller == tokenToOwner[_tokenId]
        || getApproved(_tokenId) == _caller
        || isApprovedForAll(tokenToOwner[_tokenId], _caller));
        _;
    }

    modifier canOperate(uint256 _tokenId) {
      address tokenOwner = tokenToOwner[_tokenId];
      require(tokenOwner == msg.sender || ownerToOperator[tokenOwner][msg.sender]);
      _;
    }

    modifier validNFToken(uint256 _tokenId) {
      require(tokenToOwner[_tokenId] != address(0));
      _;
    }

    function mint(uint256 _tokenId) public {
        require(tokenToOwner[_tokenId] == address(0), "this token belongs to someone else already");

        tokenToOwner[_tokenId] = msg.sender;
        ownerToBalance[msg.sender] += 1;

        emit Transfer(address(0), msg.sender, _tokenId);
    }

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///  function throws for queries about the zero address.
    /// @param _owner An address for whom to query the balance
    /// @return The number of NFTs owned by `_owner`, possibly zero
    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0), "cannot ask of balance of address 0");
        return ownerToBalance[_owner];
    }

    /// @notice Find the owner of an NFT
    /// @dev NFTs assigned to zero address are considered invalid, and queries
    ///  about them do throw.
    /// @param _tokenId The identifier for an NFT
    /// @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) external view returns (address) {
        return tokenToOwner[_tokenId];
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external validNFToken(_tokenId) hasPermission(msg.sender, _tokenId) payable {
        // WILL NOT IMPLEMENT
        address tokenOwner = tokenToOwner[_tokenId];
        require(tokenOwner == _from);
        require(_to != address(0));

        this.transferFrom(_from, _to, _tokenId);

        if (isContract(_to)) {
          bytes4 retval = ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data);
          require(retval == bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")));
        }
    }

    function isContract(address addr) internal view returns(bool){
      uint256 size;
      assembly { size := extcodesize(addr)}
      return size > 0;
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {
        this.safeTransferFrom(_from, _to, _tokenId, "");
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable hasPermission(msg.sender, _tokenId) {

        transferFromHelper(_from, _to, _tokenId);
    }

    function transferFromHelper(address _from, address _to, uint256 _tokenId) internal {

        tokenToOwner[_tokenId] = _to;
        ownerToBalance[_from] -= 1;

        emit Transfer(_from, _to, _tokenId);
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable {
        require(tokenToOwner[_tokenId] == msg.sender);

        tokenToApproved[_tokenId] = _approved;

        emit Approval(msg.sender, _approved, _tokenId);
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external {
        ownerToOperator[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) public view returns (address) {
        return tokenToApproved[_tokenId];
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return ownerToOperator[_owner][_operator];
    }
}
