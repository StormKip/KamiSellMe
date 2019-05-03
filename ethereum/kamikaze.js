import web3 from './web3';
import Kamikaze from './build/Kamikaze';

export default (address) => {
  return new web3.eth.Contract(
      JSON.parse(Kamikaze.interface),
      address
  );
};