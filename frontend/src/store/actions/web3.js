import Web3 from 'web3';
import web3Modal from '../../web3/web3func';

import * as actionTypes from './actionTypes';


export const updateWallet = (wallet, notify, balances) => {
    return {
        type: actionTypes.UPDATE_WALLET,
        wallet: wallet,
        notify: notify,
        balances: balances,

        address: wallet.currentProvider.selectedAddress,
    }
}

export const fetchBalances = async (web3, address) => {
    
    let ethInst = await web3.eth.getBalance(address, (err, balance) => {
        return balance;
        });
    let ethbalance = web3.utils.fromWei(ethInst, 'ether')

    let balances = {
        ether: ethbalance
    }

    return balances;
}

export const connectToWallet = () => {
    return async dispatch => {
        await web3Modal.connect().then(async (provider) => {

            let web3 = new Web3(provider);
            let notify;
            
            if (web3Modal.providerController.cachedProvider === 'injected') {
                notify = false;
            } else {
                notify = true;
            }
            
            let balances = await fetchBalances(web3, provider.selectedAddress);
            dispatch(updateWallet(web3, notify, balances));


            provider.on("accountsChanged", async (address) => {
                let balances = await fetchBalances(web3, address[0]);
                dispatch(updateWallet(web3, notify, balances));
                });
          })
    }
}

