import React from 'react';

import classes from './App.css';
import Layout from './hoc/Layout/Layout';
import Toolbar from './components/Toolbar/Toolbar';
import Coin from './containers/Coin/Coin';

function App() {
        return (
            <Layout>
            <div className='App'>
                <div className='coinflip_section'>
                    <h1>CoinFlip</h1>
                    <Coin />
                </div>

                <div className='settings_section'>
                    <Toolbar />
                </div>

            </div>
            </Layout>
          );
}

export default App;
