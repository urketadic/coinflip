import React, { Component } from 'react';
import classes from './Coin.module.css';

import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import moment from 'moment';

import Web3 from 'web3';
import web3Modal from '../../web3/web3func';
import * as web3Actions from '../../store/actions/index';

import heads from '../../assets/images/heads.png';
import tails from '../../assets/images/tails.png';
import loading from './../../assets/images/loading.svg';
import questionmark from './../../assets/images/questionmark.gif';

import CoinABI from '../../web3/abi/coinflip';


class Coin extends Component {

    constructor(props) {
        super(props);
        this.betInput = React.createRef();

        this.state = {
            side: 'heads',
            loading: undefined,
            betting_amount: '',
            selected_side: 'heads',
            win_message: 'You won!',
            lose_message: 'You have lost the bet!',
            games: []
        }
    }

    async componentDidMount () {
        if(web3Modal.providerController.cachedProvider === 'injected') {
            await this.props.connectToWallet();
        }
        const web3 = await this.props.web3;
        await this.render_history(web3);

        console.log(this.state.games[0]);
    }

    flip_coin = async () => {

        const web3 = this.props.web3;

        if (web3.eth === undefined) {
            toast.dismiss();
            toast.warning(`😑 Please connect the wallet first.`, {
                position: "top-center"
            });
            return;
        }

        if (this.betInput.current.value === undefined || this.betInput.current.value <= 0) {
            toast.dismiss();
            setTimeout(() => {
                toast.warning(`😑 Bet at least 0.02 eth first.`, {
                    position: "top-center"
                });
            }, 400);
            return;
        } 

        this.setState({loading: true})
        const coinFlipInstance = new web3.eth.Contract(CoinABI, this.props.CONTRACTS.COINFLIP);

        await coinFlipInstance.methods.Play().send({from: this.props.address, value: web3.utils.toWei(this.state.betting_amount, "ether")});

        let gamecount = await coinFlipInstance.methods.getGameCount().call();
        let lastgame = await coinFlipInstance.methods.getGameEntry(gamecount - 1).call();

        let selected_side = this.state.selected_side;

        //Yes I know this could have been shorter by having coin_side boolean instead of 'heads' or 'tails'
        if (lastgame.winner && selected_side === 'heads') {
            this.setState({ side: 'heads', loading: false })
            toast.success(`🦄 Its heads! ${this.state.win_message}`, {
                position: "top-center",
            });

        } else if (lastgame.winner && selected_side === 'tails') {
            this.setState({ side: 'tails', loading: false })
            toast.success(`🦄 Its tails! ${this.state.win_message}`, {
                position: "top-center",
            });
        }
          else if (lastgame.winner === false && selected_side === 'heads') {
            this.setState({ side: 'tails', loading: false })
            toast.error(`🦄 Its tails! ${this.state.lose_message}`, {
                position: "top-center",
            });
        }
          else if (lastgame.winner === false && selected_side === 'tails') {
            this.setState({ side: 'heads', loading: false })
            toast.error(`🦄 Its heads! ${this.state.lose_message}`, {
                position: "top-center",
            });
        }
        this.render_history(web3);
    }

    render_coin = (side) => {
        let coin_side = side === 'heads' ? heads : tails;
        return (
            <img src = {coin_side} width = '200px' height = '200px' alt = 'coinside' draggable = {false} className = {classes.coinimg} />
        )
    }

    input_change_handler = (e) => {
        let value = e.target.value.toString();

        if (value > 0.2) {
            value = '0.2'
        } else if (value < 0.02 && value.length > 3) {
            value = '0.02'
        }
        
        this.setState({betting_amount: value});
    }

    select_change_handler = (e) => {
        this.setState({selected_side: e.target.value});
    }

    render_history = async (web3) => {
        
        const coinFlipInstance = new web3.eth.Contract(CoinABI, this.props.CONTRACTS.COINFLIP);
        
        let gamecount = await coinFlipInstance.methods.getGameCount().call();
        let games = [];
        
        for (let i = 1; i < gamecount; i++) {
            let game = await coinFlipInstance.methods.getGameEntry(i).call();
            game['time'] = '3pm';
            games.unshift(game);

            if(i > 10) {
                games.pop();
            }
        }

        this.setState({games: games});
    }

    format_address = (address) => {
        let first6 = address.substring(0,6);
        let last4 = address.substring(address.length - 4, address.length);

        return `${first6}...${last4}`;
    }

    format_time = (unix) => {
        let time = moment.unix(unix).format('HH:mm')
        return time;
    }

    render() {
        return (
            <div className='container'>
                
                <div className={classes.coin}>
                    {this.state.loading === undefined ? 
                        <img src = {questionmark} width = '200px' height = '200px' alt = 'loading...' draggable = {false} />
                    : null }  

                    {this.state.loading ?
                        <div>
                            <img src = {loading} width = '250px' height = '250px' alt = 'loading...' draggable = {false} />
                        </div> : this.state.loading !== undefined ? this.render_coin(this.state.side) : null
                    } 
                    
                </div>

               
                
                <div style = {{display: 'flex', justifyContent: 'center'}}>
                    
                    <div className={classes.settings}>
                        <label htmlFor = 'betting_amount'> Gamble </label>
                        <input type = 'number' placeholder = 'Min: 0.02 ETH, Max: 0.2 ETH' id ='betting_amount'
                            value = {this.state.betting_amount} onChange = {(e) => this.input_change_handler(e)}
                            ref={this.betInput} />
                    </div>

                    <div className={classes.settings}>
                        <label htmlFor = 'coinside'> On </label>
                        <select id = 'coinside' className = {classes.coinsideopt} 
                                onChange = {this.select_change_handler} value = {this.state.selected_side}>
                            <option value = 'heads'>Heads</option>
                            <option value = 'tails'>Tails</option>
                        </select>
                    </div>

                 </div>

                    <button onClick = {this.flip_coin} className = {classes.flipbtn}>Flip Coin</button>


                    <table className={classes.fixed_headers}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Address</th>
                                <th>Bet Size</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.games.map((bet, index) => { 
                                //address addr, uint blocknumber, uint blocktimestamp, uint bet, uint prize, bool winner
                                return (
                                <tr key={index}>
                                    <td>{this.format_time(bet.blocktimestamp)}</td>
                                    <td>{this.format_address(bet.addr)}</td>
                                    <td>{bet.bet / 1000000000000000000} eth</td>
                                    <td>{bet.winner ? 
                                        <span style={{color: '#569f4e', fontWeight: '500'}}>Won</span> : 
                                        <span style={{color: '#c62641', fontWeight: '500'}}>Lost</span>}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>

            </div>
          );
    }
}

const mapStateToProps = state => {
    return {
        address: state.address,
        wallet: state.web3instance,
        CONTRACTS: state.CONTRACTS,
        web3: state.web3instance
    };
}


const mapDispatchToProps = dispatch => {
    return {
        connectToWallet: () => dispatch(web3Actions.connectToWallet())
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Coin);