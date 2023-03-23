import Web3 from 'web3';
import { useState } from 'react';
import artifact from '../../build/contracts/Deluxer.json';

declare let window: any;
let from: string;
let web3: any;
let DeluxerContract: any;
let balanceDeluxer: any;

export const Metamask = () => {
  const [ isConnectedProvider, setIsConnectedProvider ] = useState(false);

  const connectWeb3 = async() => {
    if(!window.ethereum) {
      alert('Required web3 provider');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      const account = await web3.eth.getAccounts();
      from = account[0];


      let networkId = await web3.eth.net.getId();

      DeluxerContract = new web3.eth.Contract(
        artifact.abi,
        artifact.networks[networkId as keyof typeof artifact.networks].address
      );

      balanceDeluxer = await DeluxerContract.methods.balanceOf(from).call();

      setIsConnectedProvider(true);
    } catch (error) {
      alert('Not connected web3 provider');
    }
    
  }

  const submitFormSend = async(event: any) => {
    event.preventDefault();
    const { address, amount } = event.target;

    if(Number(amount.value) <= 0) {
      alert('Amount not allowed');
      return;
    }

    if(!web3.utils.isAddress(address.value)) {
      alert('Address invalid');
      return;
    }

    web3.eth.sendTransaction({
      from:from,
      to: address.value,
      value: amount.value
    })
  }

  const submitFormERC20 = async(event: any) => {
    event.preventDefault();
    const { recipientErc20, amountErc20 } = event.target;

    if(Number(amountErc20.value) <= 0) {
      alert('Amount not allowed');
      return;
    }

    if(!web3.utils.isAddress(recipientErc20.value)) {
      alert('Address invalid');
      return;
    }

    DeluxerContract.methods.transfer(recipientErc20.value, amountErc20.value).send({
      from,
    });

  }  



  return (
    <>
      {
        (!isConnectedProvider)
        ? <button onClick={connectWeb3}>Conectar</button>
        : ''
      }
      {
        (isConnectedProvider)
        ? <>
          <form onSubmit={submitFormSend}>
            <h2>Eth</h2>
              <label>Account: </label> { from } <br/>

              <label htmlFor="">Address</label>
              <input type="text" id="address" placeholder="address"></input>
              <label htmlFor="">Cantidad</label>
              <input type="text" id='amount' placeholder="amount"></input>
              <button>Enviar</button>
          </form>

          <form onSubmit={submitFormERC20}>
            <h2>ERC20</h2>
            <label htmlFor="">Balance: {balanceDeluxer} DXL</label> <br/>

            <label htmlFor="">Address</label>
            <input type="text" id="recipientErc20" placeholder="address"></input>
            <label htmlFor="">Cantidad</label>
            <input type="text" id='amountErc20' placeholder="amount"></input>
            <button>Enviar</button>
          </form>
        </>
        : ''
      }
    </>
  )
}