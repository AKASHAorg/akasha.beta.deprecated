var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Web3 from 'web3';
export const regenWeb3 = (web3) => {
    let web3Regen;
    web3Regen = new Web3(web3);
    return web3Regen;
};
const registerWithExecution = function (nextExecution) {
    window.addEventListener('load', () => __awaiter(this, void 0, void 0, function* () {
        let web3Local;
        if (window.hasOwnProperty('ethereum')) {
            web3Local = regenWeb3(window['ethereum']);
            try {
                yield (window['ethereum']).enable();
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
    }));
};
export default registerWithExecution;
//# sourceMappingURL=register-web3-provider.js.map