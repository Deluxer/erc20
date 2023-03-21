import Web3 from 'web3';
import { useState } from 'react';

declare let window: any;
let from: string;
let web3: any;

export const Metamask = () => {
  const [ isConnectedProvider, setIsConnectedProvider ] = useState(false);

  const submitForm = async(event: any) => {
    event.preventDefault();
    const { address, amount } = event.target;
    web3 = new Web3(window.ethereum);
    const account = await web3.eth.getAccounts();
    from = account[0];

    if(Number(amount.value) <= 0) {
      alert('Valor no permitido');
      return;
    }

    if(!web3.utils.isAddress(address.value)) {
      alert('Direccion no valida')
      return;
    }

    web3.eth.sendTransaction({
      from:from,
      to: address.value,
      value: amount.value
    })

  }

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

      setIsConnectedProvider(true);
    } catch (error) {
      alert('Not connected web3 provider');
    }
    
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
        ? <form onSubmit={submitForm}>
          <label>Account: </label> { from } <br/>

          <label htmlFor="">Address</label>
          <input type="text" id="address" placeholder="address"></input>
          <label htmlFor="">Cantidad</label>
          <input type="text" id='amount' placeholder="amount"></input>
          <button>Enviar</button>
        </form>
        : ''
      }
    </>
  )
}