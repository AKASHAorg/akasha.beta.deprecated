import Web3 from 'web3';
export const regenWeb3 = (web3) => {
    let web3Regen;
    web3Regen = new Web3(web3);
    return web3Regen;
};
const registerWithExecution = function (nextExecution) {
    let web3Local;
    if (window.hasOwnProperty('ethereum')) {
        web3Local = regenWeb3(window['ethereum']);
        try {
            window['ethereum'].enable();
            web3Local.eth.getAccounts((err, accList) => {
                if (err) {
                    throw err;
                }
                nextExecution(web3Local, accList);
            });
        }
        catch (e) {
            nextExecution(web3Local, false);
        }
    }
    else {
        nextExecution(false, false);
    }
};
export default registerWithExecution;
//# sourceMappingURL=register-web3-provider.js.map