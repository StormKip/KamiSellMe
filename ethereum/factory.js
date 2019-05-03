import web3 from './web3';
import KamikazeFactory from './build/KamikazeFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(KamikazeFactory.interface),
    '0x862b127301DE7E0c4F39Fc11fB7f9098C5268524'
);

export default instance;