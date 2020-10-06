import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Jazzicon from '@metamask/jazzicon';

import classes from './Toolbar.module.css';

import * as web3Actions from '../../store/actions/index';

export const TokenPrices = (token) => {
    const price = useSelector(state => state.prices[token])
    return <div className={classes.price}>Price: ${price}</div>
  }

export const TokenBalances = (token) => {
    const balance = useSelector(state => state.balances[token])
    return <span className={classes.balance}> {balance}</span>
  }

const Toolbar = (props) => {

    const dispatch = useDispatch()
    const address = useSelector(state => state.address);
    const identicon = useRef(null);

    useEffect(() => {
        if (address && identicon.current) {
            identicon.current.innerHTML = ''
            identicon.current.appendChild(Jazzicon(18, parseInt(address.slice(2, 10), 16)))
        }
      }, [address])


    function format_address(address) {
        let first6 = address.substring(0,6);
        let last4 = address.substring(address.length - 4, address.length);

        return `${first6}...${last4}`;
    }

    return (
        <div className={classes.Toolbar}>
            <div className={classes.ToolbarContent}>

                <div className={classes.rightblock}>

                    
                   <div className={classes.walletinfo}>
                   <div style={{height: '1.1em'}} ref={identicon}></div>
                        { address ? <div className={classes.address}> {format_address(address)} </div> :
                        <div className={classes.connect_meta}
                             onClick={() => dispatch(web3Actions.connectToWallet())}>  
                            <i className="fas fa-wallet"></i>Connect wallet
                        </div> }
                        {/* <div className={classes.pending}>0 pending tx</div> */}
                    </div>

                </div>

            </div>
            
        </div>


    )
};

export default Toolbar;