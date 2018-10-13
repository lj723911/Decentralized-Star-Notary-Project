let ContractInfo = require("./constant").ContractInfo

const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(bodyParser.json());

//allow custom header and CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

let Web3 = require("web3")
let web3

let abi = ContractInfo.abi
let address = ContractInfo.address
let provider = ContractInfo.provider

if(typeof web3 != 'undefined') {
    web3 = new Web3(web3.currentProvider) // what Metamask injected
} else {
    // Instantiate and set Ganache as your provider
    web3 = new Web3(new Web3.providers.HttpProvider(provider));
}

// The default (top) wallet account from a list of test accounts
web3.eth.defaultAccount = web3.eth.accounts[0];

let starNotary = new web3.eth.Contract(abi,address);
console.log(web3.version)

// routers
app.post('/claimstar',async (req,res) => {
   let { starName, starStory, dec, mag, cent } = req.body;

   let id = web3.utils.sha3(dec+mag+cent)
   let account = await web3.eth.getAccounts().then(accounts =>{
       return accounts[0]
     })

   starNotary.methods.createStar(id,starName,starStory,dec,mag,cent).send({from:account})
         .on('transactionHash',function(hash){console.log(hash)})
         .on('confirmation', function(confirmationNumber){console.log(confirmationNumber)})
         .on('receipt',function(receipt){console.log(receipt);res.send(error)})
         .on('error',error => {res.send(error)})
})


app.get('/getStarInfo/:tokenId', (req, res) => {
  let { tokenId } = req.params;
  starNotary.methods.tokenIdToStarInfo(tokenId).call()
  .then(async function(result){
    let starInfo = JSON.parse(result)
    let owner = await starNotary.methods.ownerOf(tokenId).call()
                      .then(val => {return val;})
    if(starInfo[0]==''&&starInfo[1]==''&&starInfo[2]==''&&starInfo[3]==''&&starInfo[4]==''){
      res.send({starInfo:"No star found!"})
    } else {
      res.send({starInfo,owner})
    }
  })
  .catch(err => res.send(err))
})

app.listen(8000, () => console.log('app listening on:localhost:8000...'))
