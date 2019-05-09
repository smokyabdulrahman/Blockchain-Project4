/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    async generateGenesisBlock(){
        // Add your code here
        let height = await this.bd.getBlocksCount();
        if (height == -1) {
            this.addBlock(new Block.Block("GenesisBlock")).then(data => console.log("GenesisBlock CREATED! =>", data));
        }
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        return this.bd.getBlocksCount();
    }

    // Add new block
    async addBlock(newBlock) {
        // Block height
        let height = await this.bd.getBlocksCount();
        newBlock.height = parseInt(height)+1;
        height = newBlock.height;

        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);

        // previous block hash
        if(height>0){
            let prevBlock = await this.getBlock(height-1);
            prevBlock = JSON.parse(prevBlock);
            newBlock.previousBlockHash = prevBlock.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain
        return this.bd.addLevelDBData(height, JSON.stringify(newBlock));
    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here
        return this.bd.getLevelDBData(height);
    }


    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        // get block object
        let block = await this.getBlock(height);
        block = JSON.parse(block);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
            return true;
        } else {
            console.log('Block #'+height+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return false;
        }
    }

    // Validate Blockchain
    async validateChain() {
        // Add your code here
        let errorLog = [];
        let chainLength = await this.getBlockHeight();
        for (var i = 0; i < chainLength-1; i++) {
            // validate block
            if (!this.validateBlock(i))errorLog.push(i);
            // compare blocks hash link
            let block = await this.getBlock(i);
            block = JSON.parse(block);
            let blockHash = block.hash;
            let nextBlock = await this.getBlock(i+1);
            nextBlock = JSON.parse(nextBlock);
            let previousHash = nextBlock.previousBlockHash;
            if (blockHash!==previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
        } else {
            console.log('No errors detected');
        }
        return Promise.resolve(errorLog);
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, block).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;
