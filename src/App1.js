const { Web3 } = require('web3');
  
const getNativeTokenBalanceOfMantle = async (contractAddress) => {
    try { 
        const web3 = new Web3('https://rpc.mantle.xyz/');              
        const balanceWei = await web3.eth.getBalance(contractAddress);                
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');                       
        return parseFloat(balanceEther);
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
};
const getNativeTokenBalanceAtSpecificBlock = async (contractAddress, rpcEndpoint, hoursBefore) => {
    try {
        const web3 = new Web3(rpcEndpoint);        
        const currentBlock = await web3.eth.getBlockNumber();                
        const secondsInHour = 3600;
        const blocksPerSecond = 5; 
        const blocksBefore = BigInt(hoursBefore) * BigInt(secondsInHour) * BigInt(blocksPerSecond);
        const blockNumber = currentBlock - blocksBefore;

        const balanceWei = await web3.eth.getBalance(contractAddress, blockNumber);
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
        return parseFloat(balanceEther);
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
};

(async () => {
    try {
        const contractAddress = '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7';
        const rpcEndpoint = 'https://rpc.mantle.xyz/';
        const hoursBefore = 12;
        const nativeTokenBalanceNow = await getNativeTokenBalanceOfMantle(contractAddress);
        console.log(`Native Token Now: ${nativeTokenBalanceNow.toFixed(18)} MNT`);
        const nativeTokenBalance12HoursBefore = await getNativeTokenBalanceAtSpecificBlock(contractAddress, rpcEndpoint, hoursBefore);
        console.log(`Native Token Balance 12 hours before: ${nativeTokenBalance12HoursBefore.toFixed(18)} MNT`);
        //const balanceNow = await getNativeTokenBalanceAtSpecificBlock(contractAddress, rpcEndpoint, 0);
        const percentageChange = ((nativeTokenBalanceNow -nativeTokenBalance12HoursBefore ) /nativeTokenBalanceNow ) * 100;
        console.log(percentageChange);        
        
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
