import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tempProfileUpdate, tempProfileCreate } from '../local-flux/actions/temp-profile-actions';
import { showTerms } from '../local-flux/actions/app-actions';
import { NewProfileForm } from '../components';

const submitForm = props => () => {
    props.tempProfileCreate();
    props.history.push('/setup/new-identity-status');
};

const cancelForm = props => () =>
    props.history.push('/setup/authenticate');

const NewProfileContainer = props => (
  <NewProfileForm
    onSubmit={submitForm(props)}
    onCancel={cancelForm(props)}
    onTermsShow={props.showTerms}
    onProfileUpdate={props.tempProfileUpdate}
    tempProfile={props.tempProfile}
  />
);

NewProfileContainer.propTypes = {
    showTerms: PropTypes.func,
    tempProfileUpdate: PropTypes.func,
    tempProfile: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileCreate,
        tempProfileUpdate,
        showTerms
    }
)(NewProfileContainer);

export { NewProfileContainer };
