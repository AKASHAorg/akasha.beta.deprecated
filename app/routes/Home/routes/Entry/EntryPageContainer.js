import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { BootstrapBundleActions } from 'local-flux';

function EntryPageContainer ({ children }) {
    return (
      <div style={{ height: '100%' }}>
        <div className="col-xs-12" style={{ paddingLeft: '64px' }} >
            EntryPage. TADAA! :D
          {children}
        </div>
      </div>
    );
}
EntryPageContainer.propTypes = {
    children: PropTypes.node
};
function mapStateToProps () {
    return {};
}

function mapDispatchToProps (dispatch) {
    return {};
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapBundleActions = new BootstrapBundleActions(dispatch);
        Promise.resolve(bootstrapBundleActions.initEntryPage(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPageContainer));
