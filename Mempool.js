const bitcoinMessage = require('bitcoinjs-message')

export class Mempool {

    static instance = new Mempool();
    TimeoutRequestsWindowTime = 5*60*1000;

    constructor() {
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