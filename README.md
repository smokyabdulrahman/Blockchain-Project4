# Project #3. Web Service for a Blockchain

This is Project 3, Web Service for a Blockchain, in this project I used the classes to manage my private blockchain in Project 2, and exposed its functionality through a RESTful end points using __Express/node js__.

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node index.js__ in the root directory.
4. Go to http://localhost:8000.

## API Documentation
There are 2 endpoints in this project:
1. Create a new block -> __POST: /blockchain/__

to test this use the following curl command:
```bash
curl -X POST \
  http://localhost:8000/block/ \
  -H 'Content-Type: application/json' \
  -d '{"data": "hello"}'
```

2. Get a block using its height -> __GET: /blockchain/:blockId__

to test this use the following curl command:
```bash
curl -X GET \
  http://localhost:8000/block/0
```
i have given the endpoint __0__ which is the genesis block.

3. Error handeling, there are 2 types of errors:
   1. blockNotFound: this happens when you query a height that is not there yet.
   2. blockNotValid: when added block data causes a problem in the block creation function.
   3. blockHasNoData: when data is not provided

## Testing the project

The file __simpleChain.js__ in the root directory has all the code to be able to test the project, please review the comments in the file and uncomment the code to be able to test each feature implemented:

* Uncomment the function:
```javascript
(function theLoop (i) {
	setTimeout(function () {
		let blockTest = new Block.Block("Test Block - " + (i + 1));
		// Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
		myBlockChain.addBlock(blockTest).then((result) => {
			console.log(result);
			i++;
			if (i < 10) theLoop(i);
		});
	}, 1000);
  })(0);
```
This function will create 10 test blocks in the chain.

* Uncomment the function
```javascript
myBlockChain.getBlock(0).then((block) => {
	console.log(block);
}).catch((err) => { console.log(err);});
```
This function get from the Blockchain the block requested.

* Uncomment the function
```javascript
myBlockChain.validateBlock(0).then((valid) => {
	console.log(valid);
})
.catch((error) => {
	console.log(error);
})
```
This function validate and show in the console if the block is valid or not, if you want to modify a block to test this function uncomment this code:

```javascript
myBlockChain.getBlock(5).then((block) => {
	let blockAux = JSON.parse(block);
	blockAux.body = "Tampered Block";
	myBlockChain._modifyBlock(blockAux.height, JSON.stringify(blockAux)).then((blockModified) => {
		if(blockModified){
			myBlockChain.validateBlock(blockAux.height).then((valid) => {
				console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
			})
			.catch((error) => {
				console.log(error);
			})
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});

myBlockChain.getBlock(6).then((block) => {	
	let blockAux = JSON.parse(block);
	blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
	myBlockChain._modifyBlock(blockAux.height, JSON.stringify(blockAux)).then((blockModified) => {
		if(blockModified){
			console.log("The Block was modified");
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});
```

* Uncomment this function:
```javascript
myBlockChain.validateChain().then((errorLog) => {
	if(errorLog.length > 0){
		console.log("The chain is not valid:");
		errorLog.forEach(error => {
			console.log(error);
		});
	} else {
		console.log("No errors found, The chain is Valid!");
	}
})
.catch((error) => {
	console.log(error);
})
```
This function validates the whole chain and return a list of errors found during the validation.

## What do I learned with this Project

* I was able to identify the basic data model for a Blockchain application.
* I was able to use LevelDB to persist the Blockchain data.
* I was able to write algorithms for basic operations in the Blockchain.
