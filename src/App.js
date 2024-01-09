import React, { useState, useEffect } from 'react';
import { Web3 } from 'web3';
import { RadioGroup, RadioButton, ReversedRadioButton } from 'react-radio-buttons';


const App = () => {
  const [nativeTokenBalance, setNativeTokenBalance] = useState(null);
  const [nativeTokenBalanceBefore, setNativeTokenBalanceBefore] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7');
  const contractAddressMantle = '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7';
  const contractAddressLinea='0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7'
  const contractAddressKroma='0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859'
  const [currentWeb3, setCurrentWeb3]=useState(new Web3('https://rpc.linea.build/'))


  const getNativeTokenBalanceAtSpecificBlock = async (contractAddress, rpcEndpoint, hoursBefore) => {
    try {
      const currentBlock = await rpcEndpoint.eth.getBlockNumber();
      console.log("current block", currentBlock);
    
      const secondsInHour = 3600;
      const blocksPerSecond = 5;
    
      const hoursBeforeBigInt = BigInt(hoursBefore);
      const blocksBefore = hoursBeforeBigInt * BigInt(secondsInHour) * BigInt(blocksPerSecond);
    
      const blockNumber = currentBlock - Number(blocksBefore); // Convert BigInt to regular number
    
      const balanceWei = await rpcEndpoint.eth.getBalance(contractAddress, blockNumber);
      const balanceEther = rpcEndpoint.utils.fromWei(balanceWei, 'ether');
      return parseFloat(balanceEther);
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Handle the error as needed
    }
    
};

  const getNativeTokenBalanceOfMantle = async () => {
    try {
      // const kroma = new Web3('https://api.kroma.network');
      // const linea = new Web3('https://rpc.linea.build/');
      // const mantle = new Web3('https://rpc.mantle.xyz/');
      const balanceWei = await currentWeb3.eth.getBalance(currentAddress);
      const balanceEther = currentWeb3.utils.fromWei(balanceWei, 'ether');
      console.log(balanceEther);
      setNativeTokenBalance(parseFloat(balanceEther));
      // const nativeTokenBalance12HoursBefore = await getNativeTokenBalanceAtSpecificBlock(currentAddress, currentWeb3, 12);
      // setNativeTokenBalanceBefore(nativeTokenBalance12HoursBefore);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  };
  const getNativeTokenBalancebefore = async () => {
    try {
      // const kroma = new Web3('https://api.kroma.network');
      // const linea = new Web3('https://rpc.linea.build/');
      // const mantle = new Web3('https://rpc.mantle.xyz/');
      
      const nativeTokenBalance12HoursBefore = await getNativeTokenBalanceAtSpecificBlock(currentAddress, currentWeb3, 12);
      setNativeTokenBalanceBefore(nativeTokenBalance12HoursBefore);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  };
  const handleSubmit= ()=>{
    getNativeTokenBalanceOfMantle();
    getNativeTokenBalancebefore();
    console.log(nativeTokenBalanceBefore)
  }

  const handleRadioButtonClick = (value) => {
    if (value === "Linea") {
      setCurrentAddress(contractAddressLinea);
      setCurrentWeb3(new Web3('https://rpc.linea.build/'));  
    } else if (value === "Mantle") {
      setCurrentAddress(contractAddressMantle);
      setCurrentWeb3(new Web3('https://rpc.mantle.xyz/'));
     
    } else if (value === "Kroma") {
      setCurrentAddress(contractAddressKroma);
      setCurrentWeb3(new Web3('https://api.kroma.network'));
    }
  
    console.log(`Selected radio button: ${value}`);
    console.log('current Web3'+ currentWeb3);
  };
  console.log('current Web3'+ currentWeb3);
  


  // Add more functions for other networks if needed
  const radioGroupStyle = {
    display: 'flex',
    flexDirection: 'row', // Set the direction to horizontal
    alignItems: 'center',
    padding:'30px',
    gap:'10px'
     // Align items in the center vertically
  };

  // useEffect(() => {
  //   getNativeTokenBalanceOfMantle(); // You can call other functions here if needed
  // }, []); // This effect runs once when the component mounts

  return (
    <div>
      <h1>My React Blockchain App</h1>
      <div>
      <RadioGroup style={radioGroupStyle} onChange={(value) => handleRadioButtonClick(value)}>
  <RadioButton value="Linea">
    Linea
  </RadioButton>
  <RadioButton value="Mantle">
    Mantle
  </RadioButton>
  <RadioButton value="Kroma">
    Kroma
  </RadioButton>
</RadioGroup>

      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent:"center", cursor:"pointer" }}>
  <div style={{ background: "green", padding: "12px", color: "white" }} onClick={handleSubmit}>
   View Balance
  </div>
</div>

      {nativeTokenBalance !== null  ? (
        <p>Native Token Balance: {nativeTokenBalance.toFixed(18)}  MNT</p>
       
       
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
//Native Token Balance: {nativeTokenBalanceBefore.toFixed(18)