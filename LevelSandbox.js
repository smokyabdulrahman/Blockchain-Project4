/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        return this.db.get(key);
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        return this.db.put(key, value).then(_ => this.db.get(key));
    }

    // Method that return the height
    getBlocksCount() {
        return new Promise((res, rej) => {
            // no block is there!
            let height = -1;

            this.db.createReadStream()
                .on('data', data => height++)
                .on('error', err => rej(err))
                .on('close', _ => res(height));
        })
    }
        

}

module.exports.LevelSandbox = LevelSandbox;
