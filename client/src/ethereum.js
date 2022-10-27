import { ethers, Contract } from 'ethers';
import PredictionMarket from './contracts/PredictionMarket.json';
import ChainLinkAPIConsumer from './contracts/ChainLinkAPIConsumer.json';

const getBlockchain = () =>
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
                )

            resolve({signerAddress, predictionMarket, oracle});
            }
            resolve({signerAddress: undefined, predictionMarket: undefined, oracle: undefined});
        });
    });

export default getBlockchain;