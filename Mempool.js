export class Mempool {

    static instance = new Mempool();
    TimeoutRequestsWindowTime = 5*60*1000;

    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
    }

    removeValidationRequest(walletAddress) {
        this.mempool = this.mempool.filter(val => val != walletAddress);
        clearTimeout(this.timeoutRequests[walletAddress]);
    }

    addValidationRequest(walletAddress) {
        this.mempool.push(walletAddress);
        this.timeoutRequests[walletAddress]=setTimeout(function(){ this.removeValidationRequest(walletAddress) }, TimeoutRequestsWindowTime );
    }

    // validateRequest(param, param ...)

}