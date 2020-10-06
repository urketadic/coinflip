import React from 'react';

import Aux from '../Auxi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './Layout.module.css';

const Layout = (props) => (
    <Aux>
    <ToastContainer />
    <main className={classes.Content}>
        {props.children}
    </main>
    </Aux>
);

export default Layout;