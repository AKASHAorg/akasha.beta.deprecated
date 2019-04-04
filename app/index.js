// @flow strict
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getHistory from './get-history';
import Route from 'react-router-dom/Route';
import Router from 'react-router-dom/Router';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './styles/ant-icons/iconfont.css';
import ConnectedIntlProvider from './connected-intl-provider';
import rootSaga from './local-flux/sagas';
import storeConfig from './local-flux/store/configureStore';
import sagaMiddleware from './local-flux/store/sagaMiddleware';
import chReqService from './local-flux/services/channel-request-service';
import { Application, Setup, Synchronization } from './containers';
import { AppErrorBoundary } from './components';
import { loadAkashaDB } from './local-flux/services/db/dbs';
import * as settingsService from './local-flux/services/settings-service';
import { MainContext } from './context';
import { settingsActions } from './local-flux/actions';
// $FlowFixMe
import './styles/core.scss';
// $FlowFixMe
import './styles/ant-vars/extract-default-theme.less';
/*
 * Method to be executed by main to bootstrap frontend
 * @param web3Enabled <Boolean> true if a web3 provider is detected (ex. metamask).
    false otherwise (eg. desktop version)
 * @param vault <Boolean> true (on web) if user accepted to reveal his address through metamask

 * @param channel <Object> Communication channel with backend
 * @param logger <Object> Pino logger
 */
export const bootstrap = (
    web3Enabled /* : boolean */ = false,
    vault /* : boolean */ = false,
    channel /* : Object */,
    logger /* : Object */
) => {
    const store = storeConfig();
    // add dispatch method the the instance of chReqService
    chReqService.setDispatch(store.dispatch);
    chReqService.setLogger(logger);
    // add <IPC> Channel to the instance of chReqService
    chReqService.setIPCChannel(channel);
    // add listener for IPC channel;
    chReqService.addResponseListener();
    // add logger context to sagas via rootSaga
    sagaMiddleware.run(rootSaga, logger, chReqService);

    // --------- <Dev only> --------------- //
    global.redux__store = store;
    global.ipc__channel = channel;
    // --------- </Dev only> --------------- //

    const rootNode = document.getElementById('root') || document.body;

    loadAkashaDB()
        .then(() => {
            logger.info('[index.js] AkashaDB successfuly loaded, continuing...');
            return Promise.all([
                settingsService.appSettingsRequest(),
                settingsService.gethSettingsRequest(),
                settingsService.ipfsSettingsRequest()
            ])
                .then(([appSettings, gethSettings, ipfsSettings]) => {
                    store.dispatch(settingsActions.getAppSettingsSuccess(appSettings));
                    store.dispatch(settingsActions.gethSettingsSuccess(gethSettings));
                    store.dispatch(settingsActions.ipfsSettingsSuccess(ipfsSettings));
                    return [appSettings, gethSettings, ipfsSettings];
                })
                .catch(err => {
                    store.dispatch(settingsActions.getAppSettingsError(err));
                    store.dispatch(settingsActions.gethSettingsError(err));
                    store.dispatch(settingsActions.ipfsSettingsError(err));
                    throw err;
                });
        })
        .then(([appSettings, gethSettings, ipfsSettings]) => {
            logger.info(
                { appSettings, gethSettings, ipfsSettings },
                '[index.js] settings loaded, trying to render the app'
            );
            try {
                renderApplication(store, web3Enabled, vault, channel, logger, rootNode);
            } catch (ex) {
                throw ex;
            }
        })
        .catch(ex => {
            logger.error({ error: ex }, '[index.js] Cannot load database!!');
            console.debug(ex, 'the exception');
            Object.keys(ex).forEach(key => console.log(key, 'the key'));
            if (rootNode) {
                return render(
                    <Provider store={store}>
                        <ConnectedIntlProvider>
                            <AppErrorBoundary
                                error={{
                                    name: `[index.js] ${ex.name}\n`,
                                    message: `${ex.stack}`
                                }}
                            />
                        </ConnectedIntlProvider>
                    </Provider>,
                    rootNode
                );
            }
        });
};

// eslint-disable-next-line complexity
const renderApplication = (store, web3Enabled, vault, channel, logger, rootNode, isSynced = false) => {
    const history = getHistory();
    const isSetupActive = !web3Enabled;
    const isAppActive = isSynced && web3Enabled;
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
                                                    rootNode
                                                );
                                            }}
                                        />
                                    )}
                                    {/* Setup => Application setup page */}
                                    {isSetupActive && <Setup {...props} />}
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
