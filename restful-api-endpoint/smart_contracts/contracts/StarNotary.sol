pragma solidity ^0.4.23;

import './ERC721Token.sol';

contract StarNotary is ERC721Token {

    struct Star {
        string starName;
        string starStory;
        string Cent;
        string Dec;
        string Mag;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => bool) public coordinateToExist;
    mapping(uint256 => uint256) public starsForSale;

    function strConcat(string _a, string _b) internal pure returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++)bret[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(bret);
   }

    function createStar(uint256 _tokenId, string _name, string _story, string _cent, string _dec, string _mag) public {
        Star memory newStar = Star(_name,_story, _cent, _dec, _mag);
        require(checkIfStarExist(_cent,_dec,_mag) == false, "the star is already exist!");

        uint256 coordinateId = uint256(keccak256(abi.encodePacked(strConcat(strConcat(_cent, _dec), _mag))));
        coordinateToExist[coordinateId] = true;
        tokenIdToStarInfo[_tokenId] = newStar;
        ERC721Token.mint(_tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);

        require(msg.value >= starCost);

        clearPreviousStarState(_tokenId);

        transferFromHelper(starOwner, msg.sender, _tokenId);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }

        starOwner.transfer(starCost);
    }

    function clearPreviousStarState(uint256 _tokenId) private {
        //clear approvals
        tokenToApproved[_tokenId] = address(0);
        //clear being on sale
        starsForSale[_tokenId] = 0;
    }

    function checkIfStarExist(string _cent, string _dec, string _mag) public view returns (bool) {
      uint256 tokenId = uint256(keccak256(abi.encodePacked(strConcat(strConcat(_cent, _dec), _mag))));
      if(coordinateToExist[tokenId] == true) return true;
      return false;
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns (string) {
      string[] memory values = new string[](5);
      string memory result = '["';
      values[0] = tokenIdToStarInfo[_tokenId].starName;
      values[1] = tokenIdToStarInfo[_tokenId].starStory;
      values[2] = tokenIdToStarInfo[_tokenId].Dec;
      values[3] = tokenIdToStarInfo[_tokenId].Mag;
      values[4] = tokenIdToStarInfo[_tokenId].Cent;
      for(uint i=0;i<4;i++){
        result = strConcat(result, values[i]);
        result = strConcat(result, '","');
      }
      result = strConcat(result, values[4]);
      result = strConcat(result, '"]');
      return result;
    }
}
