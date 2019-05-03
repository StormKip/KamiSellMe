const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/KamikazeFactory.json');

const provider = new HDWalletProvider(
    'reduce submit coil shadow loud pigeon abstract used isolate nerve sea attack',
    'https://rinkeby.infura.io/v3/f5b6ea52f5714b239789f584afb03454'
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from an account', accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    )
        .deploy({
            data: '0x'+ compiledFactory.bytecode})
        .send({
            gas: '4000000',
            from: accounts[0]});
    console.log('Contract deployed to ', result.options.address);
};

deploy();