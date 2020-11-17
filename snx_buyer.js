async function main() {
    const Web3 = require('web3');
    const fs = require('fs');
    const HDWalletProvider = require('truffle-hdwallet-provider');

    var jsonFile = "build/contracts/SynthBuyer.json";
    var parsed= JSON.parse(fs.readFileSync(jsonFile));
    var abi = parsed.abi;

    const mnemonic = "firm truly cereal release system love charge million sound board save guess";
    const provider = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/c6ea1fc224384fcbbd67c39852f9536b`)


    const rate = 0.07232982/72329821279743179
    var web3 = new Web3(provider);
    web3.eth.defaultAccount = '0xc64F72dE9dca0600DbcC734491Cb318242D303E8';

    const SynthBuyer = new web3.eth.Contract(abi, '0x619DEeBA1a79907e66f0193f28cDa10683f6974a');

    async function Buy(amount) {
        console.log("Checking balance before buying...");
        await Check();

        snx = await SynthBuyer.methods.buySNX(amount).send({from: web3.eth.defaultAccount, value: 1e15})
        .on('transactionHash', function(h){
            console.log("got tx hash: https://ropsten.etherscan.io/tx/" + h);
        })
        .on("receipt", function(){
            console.log("got receipt...");
        })
        .on("confirmation", function(){
            console.log("tx confirmed!");
        });

        console.log("Checking balance after buying...")
        await Check();
    }

    async function Check() {
        balance = await SynthBuyer.methods.getBalance().call();
        console.log("balance: " + balance*rate + " SNX");
    }

    await Buy(1e14);
}

main();
