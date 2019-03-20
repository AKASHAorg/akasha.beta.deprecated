//@flow strict
import * as React from 'react';
import { connect } from 'react-redux';
import { MainContext } from '../../index';
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

function withRequest /* ::<Config: {}> */(
    WrappedComponent /* : React.AbstractComponent <WrappedComponentProps, Config> */
) {
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
            const { dispatch, state } = this.props;
            let bool = true;
            if (typeof condition === 'function') {
                bool = condition(state);
            }
            if (typeof condition === 'boolean') {
                bool = condition;
            }
            if (condition) {
                if (bool) {
                    dispatch(actionPayload);
                    this.requestsQueue = this.requestsQueue.filter(
                        req => req.action.type !== actionPayload.type
                    );
                } else {
                    this.addRequestToQueue(actionPayload, condition);
                }
            } else {
                const { logger } = this.props;
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
            {({ logger }) => <WithRequestWrapper forwardedRef={ref} logger={logger} {...props} />}
        </MainContext.Consumer>
    );

    return connect(mapStateToProps)(React.forwardRef(forwardRef));
}
export default withRequest;
