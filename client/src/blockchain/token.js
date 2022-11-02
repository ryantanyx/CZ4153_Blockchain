import { ethers, Contract } from 'ethers';
import ERC20Basic from '../contracts/ERC20Basic.json';

// Get an instance of the token contract
export const getToken = (tokenAddress) =>
    new Promise((resolve, reject) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new Contract(
            tokenAddress,
            ERC20Basic.abi,
            provider
        );
        resolve(tokenContract);
    })

// Get the balance of the token in an address
export const getTokenBalance = async (tokenContract, walletAddress) => {
    const balance = (await tokenContract.balanceOf(walletAddress)).toString();
    return balance;
}