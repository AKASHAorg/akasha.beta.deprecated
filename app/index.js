// @flow strict
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getHistory from './history';
import Route from 'react-router-dom/Route';
import Router from 'react-router-dom/Router';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './styles/ant-icons/iconfont.css';
import ConnectedIntlProvider from './connected-intl-provider';
import rootSaga from './local-flux/sagas';
import storeConfig from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import chReqService from './local-flux/services/channel-request-service';
import {
    Application,
    Authentication,
    Setup,
    Registration,
    ExternalLogin,
    Synchronization
} from './containers';
import { AppErrorBoundary } from './components';
import { loadAkashaDB } from './local-flux/services/db/dbs';
import { MainContext } from './context';
import './styles/core.scss';
import './styles/ant-vars/extract-default-theme.less';

// Method to be executed by main to bootstrap frontend
export const bootstrap = (
    web3Enabled /* : boolean */ = false,
    vault /* : boolean */ = false,
    channel /* : Object */,
    logger /* : Object */
) => {
    const store = storeConfig();
    // add logger context to sagas
    sagaMiddleware.run(rootSaga, logger);
    // add dispatch method the the instance of chReqService
    chReqService.setDispatch(store.dispatch);
    chReqService.setLogger(logger);
    // add channel <IPC Channel to the instance of chReqService>
    chReqService.setIPCChannel(channel);

    // --------- <Dev only> --------------- //
    global.redux__store = store;
    global.ipc__channel = channel;
    // --------- </Dev only> --------------- //

    const rootNode = document.getElementById('root') || document.body;

    loadAkashaDB(err => {
        if (err && rootNode) {
            logger.error('[index.js] Cannot load database!!');
            return render(<AppErrorBoundary error={Error('Cannot load database!')} />, rootNode);
        }
        try {
            logger.info('[index.js] AkashaDB successfuly loaded, rendering app...');
            const isMetamask = window.ethereum && window.ethereum.isMetaMask;
            if (isMetamask) {
                window.ethereum.on('accountsChanged', accounts => {
                    logger.info('[index.js] A new account is in use now!', accounts[0]);
                    return renderApplication(
                        store,
                        web3Enabled,
                        accounts[0] !== undefined,
                        channel,
                        logger,
                        isMetamask,
                        rootNode
                    );
                });
            }
            renderApplication(store, web3Enabled, vault, channel, logger, isMetamask, rootNode);
        } catch (ex) {
            if (rootNode) {
                return render(
                    <Provider store={store}>
                        <ConnectedIntlProvider>
                            <AppErrorBoundary
                                error={{
                                    name: `[index.js/75] ${ex.name}\n`,
                                    message: `${ex.stack}`
                                }}
                            />
                        </ConnectedIntlProvider>
                    </Provider>,
                    rootNode
                );
            }
        }
    });
};

// eslint-disable-next-line complexity
const renderApplication = (
    store,
    web3Enabled,
    vault,
    channel,
    logger,
    isMetamask,
    rootNode,
    isSynced = false
) => {
    const history = getHistory();
    const isAuthActive = isSynced && web3Enabled && !vault && !isMetamask;
    const isRegistrationActive = isSynced && web3Enabled && !vault && !isMetamask;
    const isSetupActive = !web3Enabled && !isMetamask;
    const isAppActive = isSynced && web3Enabled && vault;
    const isExternalLoginActive = isSynced && web3Enabled && !vault && isMetamask;
    if (rootNode) {
        render(
            <Provider store={store}>
                <ConnectedIntlProvider>
                    <Router history={history}>
                        <Route
                            render={props => (
                                <MainContext.Provider
                                    value={{
                                        web3: web3Enabled,
                                        channel,
                                        logger
                                    }}
                                >
                                    <Synchronization
                                        active={!isSynced}
                                        onSyncEnd={() => {
                                            renderApplication(
                                                store,
                                                web3Enabled,
                                                vault,
                                                channel,
                                                logger,
                                                isMetamask,
                                                rootNode,
                                                true
                                            );
                                        }}
                                    />
                                    {/* Apps entry points. All this components are standalone and can be
                                    easily removed/hidden based on platform (web, desktop, mobile, etc) */}

                                    {/* Application => the dashboard page with all the pages
                                       linked (profile, editor,etc) */}
                                    {isAppActive && (
                                        <Application
                                            {...props}
                                            reloadPage={() => {
                                                //@todo have a proper reload procedure
                                                // aka partial reset store?
                                                renderApplication(
                                                    store,
                                                    web3Enabled,
                                                    vault,
                                                    channel,
                                                    logger,
                                                    isMetamask,
                                                    rootNode
                                                );
                                            }}
                                        />
                                    )}

                                    {/* Authentication => the login page (can be hidden/removed
                                    in some cases like web version) */}
                                    {isAuthActive && <Authentication {...props} />}

                                    {/* Registration => Create profile page (standalone page).
                                    Can be hidden/removed in some cases */}
                                    {isRegistrationActive && <Registration {...props} />}

                                    {/* Setup => Application setup page */}
                                    {isSetupActive && <Setup {...props} />}

                                    {/* ExternalLogin => for now this is just a simple
                                    static page showing a message
                                    In the future we can use this page for external 3rd party
                                    login mechanism */}
                                    {isExternalLoginActive && <ExternalLogin {...props} />}
                                </MainContext.Provider>
                            )}
                        />
                    </Router>
                </ConnectedIntlProvider>
            </Provider>,
            rootNode,
            () => logger.info('[index.js] React rendered the App')
        );
    }
};
