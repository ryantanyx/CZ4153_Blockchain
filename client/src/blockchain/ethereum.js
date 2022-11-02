import { ethers, Contract } from 'ethers';
import PredictionMarket from '../contracts/PredictionMarket.json';
import PredictionGame from '../contracts/PredictionGame.json';
import ChainLinkAPIConsumer from '../contracts/ChainLinkAPIConsumer.json';

export const getBlockchain = () =>
    new Promise((resolve, reject) => {
        // Wait for browser to load fully
        window.addEventListener('load', async () => {
            // Check if metamask installed
            if(window.ethereum) {
                // Wait for metamask to approve our application
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                // User's address
                const signerAddress = await signer.getAddress();

                const predictionMarket = new Contract(
                    PredictionMarket.networks[window.ethereum.networkVersion].address,
                    PredictionMarket.abi,
                    signer
                );

                const oracle = new Contract(
                    ChainLinkAPIConsumer.networks[window.ethereum.networkVersion].address,
                    ChainLinkAPIConsumer.abi,
                    signer
                );

                resolve({signerAddress, predictionMarket, oracle});
            }
            resolve({signerAddress: undefined, predictionMarket: undefined, oracle: undefined});
        });
    });

export const getPredictionGame = (gameAddress) =>
    new Promise((resolve, reject) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const predictionGame = new Contract(
            gameAddress,
            PredictionGame.abi,
            signer
        );
        resolve(predictionGame);
    })

// Returns transaction receipt of a transaction given the transaction hash
export const getTransactionReceipt = async (txHash) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const txReceipt = await provider.getTransactionReceipt(txHash);
    return txReceipt;
}