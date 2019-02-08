import React, { Component } from 'react';
import { connect } from 'react-redux';
import reqService from '../../local-flux/services/channel-request-service';

const withRequest = (WrappedComponent) => {
    const requests = reqService.requestIds;
    class WithRequestWrapper extends Component {
        requestsQueue = [];
        componentDidUpdate () {
            // @todo verify if it's the case to
            // dispatch more actions
            this.requestsQueue.forEach(req => {
                this.dispatchAction(req.action, req.condition);
            });
        }
        shouldComponentUpdate () {
            // should update only if request state modified
            return true
        }
        addRequestToQueue = (action, condition) => {
            const targetAction = this.requestsQueue.find(req => req.action.type === action.type);
            if (!targetAction) {
                this.requestsQueue.push({
                    action,
                    condition
                });
            }

        }
        dispatchAction = (actionPayload, condition) => {
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
                    this.requestsQueue = this.requestsQueue.filter(req =>
                        req.action.type !== actionPayload.type
                    );
                } else {
                    this.addRequestToQueue(actionPayload, condition);
                }
            } else {
                dispatch(actionPayload);
            }
        }
        getActionStatus = (actionType) => {
            // action status can be null, 'pending', 'success', 'error'
            const { requestState } = this.props.state;
            let actionStatus = null;
            if (requestState.get('successActions').includes(actionType)) {
                actionStatus = 'success';
            } else
            if (requestState.get('errorActions').includes(actionType)) {
                actionStatus = 'error';
            } else
            if (Object.values(requests).find(val => val === actionType)) {
                actionStatus = 'pending';
            }
            return actionStatus;
        }
        getRequestIdStatus = (reqId) => {
            // @todo
        }
        render () {
            const { forwardedRef, state, ...other } = this.props;
            return (
              <WrappedComponent
                ref={forwardedRef}
                dispatchAction={this.dispatchAction}
                getActionStatus={this.getActionStatus}
                { ...other }
              />
            );
        }
    }
    const mapStateToProps = (state) => ({ state })

    // return connect(mapStateToProps)(WithRequestWrapper);
    const forwardRef = (props, ref) =>
      <WithRequestWrapper
        forwardedRef={ref}
        {...props}
      />;

    return connect(mapStateToProps)(React.forwardRef(forwardRef));
}

export default withRequest;
