var Web3 = require("web3")
var web3

if(typeof web3 != 'undefined') {
    web3 = new Web3(web3.currentProvider) // what Metamask injected
} else {
    // Instantiate and set Ganache as your provider
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/06ec1ae219754b23a2bed3fea410fec5"));
}

//"https://rinkeby.infura.io/v3/06ec1ae219754b23a2bed3fea410fec5"

// The default (top) wallet account from a list of test accounts
web3.eth.defaultAccount = web3.eth.accounts[0];

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_approved",
				"type": "address"
			},
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "buyStar",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_story",
				"type": "string"
			},
			{
				"name": "_cent",
				"type": "string"
			},
			{
				"name": "_dec",
				"type": "string"
			},
			{
				"name": "_mag",
				"type": "string"
			}
		],
		"name": "createStar",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "putStarUpForSale",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_operator",
				"type": "address"
			},
			{
				"name": "_approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_approved",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_operator",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_cent",
				"type": "string"
			},
			{
				"name": "_dec",
				"type": "string"
			},
			{
				"name": "_mag",
				"type": "string"
			}
		],
		"name": "checkIfStarExist",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "coordinateToExist",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "starsForSale",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenIdToStarInfo",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

// The interface definition for your smart contract (the ABI)
var starNotary = web3.eth.contract(abi).at('0xaf3a123650a12383ed314c43b65bbc3507edf216');

function getStarInfo(){
  var id = document.getElementById("searcher").value
  starNotary.tokenIdToStarInfo(id,(error,result)=>{
    if(!error){
      res = JSON.parse(result)
      if(res[0] !== '' && res[1] !== '' && res[2] !== '' && res[3] !== '' && res[4] !== '') {
        document.getElementById("StarContent").innerHTML= res;
      }else{
        document.getElementById("StarContent").innerHTML='Star is not exist!';
      }
    }else{
        alert("there has been an error:", error);
    }
  })
  starNotary.ownerOf(id,(error,result) => {
    if(!error){
      document.getElementById("owner").innerHTML = result;
    }
  })
}

function createStar(){
  let name = document.getElementById("star-name").value;
  let story = document.getElementById("star-story").value;
  let cent = "ra_"+ document.getElementById("cent").value;
  let dec = "dec_"+ document.getElementById("dec").value;
  let mag = "mag_"+ document.getElementById("mag").value;
  let id = web3.sha3(dec+mag+cent);

  web3.eth.getAccounts(function(error,accounts){
    if(error){
      console.log(error)
      return
    }
    var account = accounts[0]
    starNotary.createStar.sendTransaction(id,name,story,cent,dec,mag,{from:account},(error, result)=>{
          if(/^0x/.test(result)){
              console.log(result);
              alert('please remember your starId':id)
              location.reload();
          }
    })
  })
}
