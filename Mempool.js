const bitcoinMessage = require('bitcoinjs-message')
const TimeoutRequestsWindowTime = 5*60*1000;

class Mempool {    

    constructor() {
        if (!!Mempool.instance) {
            return Mempool.instance;
        }

        Mempool.instance = this;

        this.mempool = [];
        this.timeoutRequests = [];
        // create confirmed wallets that can add stars
        this.confirmedEntries = [];
    } 

    removeValidationRequest(walletAddress) {
        this.mempool = this.mempool.filter(val => val.walletAddress != walletAddress);
        clearTimeout(this.timeoutRequests[walletAddress]);
    }

    addValidationRequest(walletAddress, requestTimeStamp) {
        // TODO: CHECK IF THERE IS AN ENTRY BEFORE ADDING
        const entry = this.getMempoolEntry(walletAddress);
        if (entry) {
            entry.verifyTimeLeft();
            return entry;
        }
        const mempoolEntry = new MempoolEntry(walletAddress, requestTimeStamp, TimeoutRequestsWindowTime);
        this.mempool.push(mempoolEntry);
        this.timeoutRequests[walletAddress]=setTimeout(() => this.removeValidationRequest(walletAddress), TimeoutRequestsWindowTime);
        return mempoolEntry;
    }

    getMempoolEntry(walletAddress) {
        return this.mempool.filter(entry => entry.walletAddress === walletAddress)[0];
    }

    validateRequest(walletAddress, signature) {
        const entry = this.getMempoolEntry(walletAddress);
        let isValidated = bitcoinMessage.verify(entry.message, walletAddress, signature);
        if(isValidated) {
            this.removeValidationRequest(walletAddress);
            const confirmedEntry = new ConfirmedEntry(entry);
            this.confirmedEntries.push(confirmedEntry);
            return confirmedEntry;
        }
        return null;
    }

    canAddStar(address) {
        const confirmedEntry = this.confirmedEntries.filter(entry => entry.status.walletAddress === address)[0];   
        return confirmedEntry ? confirmedEntry.registerStar === true : false;
    }

    deleteConfirmedEntry(address) {
        this.confirmedEntries = this.confirmedEntries.filter(entry => entry.status.walletAddress !== address);
    }
}

class MempoolEntry {
    constructor(walletAddress, requestTimeStamp, validationWindow) {
        this.walletAddress = walletAddress;
        this.requestTimeStamp = requestTimeStamp;
        this.message = `${this.walletAddress}:${this.requestTimeStamp}:starRegistry`;
        this.validationWindow = validationWindow;
    }

    verifyTimeLeft() {
        const now = Date.now();
        const difference = now - this.requestTimeStamp;
        this.validationWindow -= difference;
        return this.validationWindow >= 0;
    }
}

class ConfirmedEntry {
    constructor(status) {
        this.registerStar = true;
        this.status = status;
    }
}

module.exports.Mempool = Mempool;