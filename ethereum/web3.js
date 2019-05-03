import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && window.web3 !== 'undefined'){
    //in browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);

} else{
    //on server or no metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/f5b6ea52f5714b239789f584afb03454'
    );

    web3 = new Web3(provider);
}

export default web3;