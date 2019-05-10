const _ = require('lodash');

const a = {"hash":"2fdfe19c6ca28781ffc15b4ef2f19807c5fa264830e1efc6601a3c020697fb02","height":0,"body":"GenesisBlock","time":"1557513579","previousBlockHash":""};
const b = _.get(a, 'height');
console.log(b);
