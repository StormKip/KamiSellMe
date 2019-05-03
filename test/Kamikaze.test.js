const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/KamikazeFactory');
const compiledKamikaze = require('../ethereum/build/Kamikaze');

let accounts;
let factory;
let kamikazeAddress;
let kamikaze;

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createUser('Storm','The first creator', 'QEJWEJBDJBWEJHHJJ').send({
        from: accounts[0],
        gas: '1000000'
    });

    [kamikazeAddress] = await factory.methods.getDeployedUsers().call();
    kamikaze = await new web3.eth.Contract(
        JSON.parse(compiledKamikaze.interface),
        kamikazeAddress
    );
});

describe( 'Kamikaze',() => {
    it('should deploy a factory and campaign',  () => {
        assert.ok(factory.options.address);
        assert.ok(kamikaze.options.address);
    });

    it('marks caller as the kamikaze user', async () =>{
        const user = await kamikaze.methods.creator().call();
        assert.equal(accounts[0], user);
    });

    it('should create item', async () => {
        const user = await kamikaze.methods.creator().call();

        const accounts = await web3.eth.getAccounts();
      await kamikaze.methods.newFile(
            'New File',
            'Game',
            'Descriptive',
            'QEWEWDDWRWDDWFDFWDW',
            '1100'
        ).send({
          from: accounts[0],
            gas: 1000000
        });

        await kamikaze.methods.newFile(
            'New File2',
            'Game2',
            'Descr2iptive',
            'QEWEWD2DWRWDDWFDFWDW',
            '11020'
        ).send({
            from: accounts[0],
            gas: 1000000
        });
        const itemCount = await kamikaze.methods.getItemsCount().call();

       const myItems = await Promise.all(
       Array(parseInt(itemCount))
       .fill()
       .map((element, index) => {
       return kamikaze.methods.items(index).call();
         })
        );
       console.log(myItems);


    });

    it('allows user to buy item', async () => {
        const user = await kamikaze.methods.creator().call();

        const accounts = await web3.eth.getAccounts();
        await kamikaze.methods.newFile(
            'New File',
            'Game',
            'Descriptive',
            'QEWEWDDWRWDDWFDFWDW',
            '1100'
        ).send({
            from: accounts[0],
            gas: 1000000
        });


        const itemCount = await kamikaze.methods.getItemsCount().call();

        const myItems = await Promise.all(
            Array(parseInt(itemCount))
                .fill()
                .map((element, index) => {
                    return kamikaze.methods.items(index).call();
                })
        );
        console.log(myItems);

        await kamikaze.methods.buyFile('0').send({ from:accounts[1], gas:1000000, value:1100})

    });

});