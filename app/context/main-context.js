// @flow strict
import * as React from 'react';

// main application context
const MainContext /*: Object*/ = React.createContext({
    web3: false,
    logger: {},
    channel: {}
});

export default MainContext;
