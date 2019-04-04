//@flow strict
import * as React from 'react';
import { connect } from 'react-redux';
import { MainContext } from '../../context';
import reqService from '../../local-flux/services/channel-request-service';

/*::
    import type { Dispatch, Store } from 'redux';
    type WrappedComponentProps = {
        dispatchAction: Function,
        dispatch: Dispatch<Object>,
        ...any
    }
    type WrapperComponentProps = {
        dispatch: Dispatch<Object>,
        state: Object,
        forwardedRef: React.Ref<any>,
        logger: Object,
    }
*/

function withRequest (WrappedComponent /* : React.AbstractComponent <*> */) {
    const requests = reqService.requestIds;
    class WithRequestWrapper extends React.Component /* :: <WrapperComponentProps> */ {
        requestsQueue /* : Array<Object> */ = [];
        componentDidUpdate () {
            // @todo IMPORTANT add a guard and check if it makes sense to iterate through reqQueue...
            // i.e. a relevant part of the store changed...
            this.requestsQueue.forEach(req => {
                this.dispatchAction(req.action, req.condition);
            });
        }
        shouldComponentUpdate () {
            //@todo: IMPORTANT should update only if request state modified
            return true;
        }
        addRequestToQueue = (action, condition) => {
            const targetAction = this.requestsQueue.find(req => req.action.type === action.type);
            if (!targetAction) {
                this.requestsQueue.push({
                    action,
                    condition
                });
            }
        };
        dispatchAction = (actionPayload /* : Object */, condition /*: Boolean | Function*/) /* : void */ => {
            const { dispatch, state, logger } = this.props;

            let bool = true;
            if (typeof condition === 'function') {
                bool = condition(state);
            }
            if (typeof condition === 'boolean') {
                bool = condition;
            }
            if (condition) {
                if (bool) {
                    logger.info('[with-request.js] Dispatching action', actionPayload.type);
                    dispatch(actionPayload);
                    this.requestsQueue = this.requestsQueue.filter(
                        req => req.action.type !== actionPayload.type
                    );
                } else {
                    // logger.info('[with-request.js] Adding action to queue', actionPayload.type);
                    this.addRequestToQueue(actionPayload, condition);
                }
            } else {
                logger.info('[with-request.js] Dispatching action', actionPayload.type);
                dispatch(actionPayload);
            }
        };
        getActionStatus = actionType => {
            // action status can be null, 'pending', 'success', 'error'
            const { requestState } = this.props.state;
            let actionStatus = null;
            if (requestState.get('successActions').includes(actionType)) {
                actionStatus = 'success';
            } else if (requestState.get('errorActions').includes(actionType)) {
                actionStatus = 'error';
            } else if (Object.values(requests).find(val => val === actionType)) {
                actionStatus = 'pending';
            }
            return actionStatus;
        };
        getRequestIdStatus = reqId => {
            // @todo
        };
        render () {
            const { forwardedRef, state, ...other } = this.props;
            return (
                <WrappedComponent
                    ref={forwardedRef}
                    dispatchAction={this.dispatchAction}
                    getActionStatus={this.getActionStatus}
                    {...other}
                />
            );
        }
    }
    const mapStateToProps = (state /* : Store<any, any> */) => ({ state });

    const forwardRef = (props, ref) => (
        <MainContext.Consumer>
            {({ logger, web3 }) => (
                <WithRequestWrapper forwardedRef={ref} web3={web3} logger={logger} {...props} />
            )}
        </MainContext.Consumer>
    );

    return connect(mapStateToProps)(React.forwardRef(forwardRef));
}
export default withRequest;

// const useRequestHook = () => {
//     const { state, dispatch } = React.useReducer();
//     const dispatchAction = () => {}
//     const getActionStatus = () => {}
//     return {
//         dispatchAction,
//         getActionStatus
//     };
// }
