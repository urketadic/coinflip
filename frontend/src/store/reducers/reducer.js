import * as actionTypes from '../actions/actionTypes';
import { toast } from 'react-toastify';


const initialState = {
    web3instance: {},
    address: '',
    transactions: [],
    balances: {
        ether: 0,
    },
    CONTRACTS: {
        COINFLIP: '0xfd82aae50a3Ceb3f288c9127C2Ac75Fd352889fE',
    }
};


const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.UPDATE_WALLET:
            if (action.notify) {
                toast.success(`🦄 Connected to ${action.wallet.currentProvider.selectedAddress.substr(0,12)}...`, {
                    position: "top-right",
                });
            }

            return {
                ...state,
                balances: {
                    ...state.balances,
                    ...action.balances
                },
                CONTRACTS: {
                    ...state.CONTRACTS
                },
                address: action.address,
                web3instance: action.wallet
            }

        default: 
            return state;
    }
};

export default reducer;