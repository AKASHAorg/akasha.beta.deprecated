import React, { Component, PropTypes } from 'react';

class NewProfileForm extends Component {
    render () {
        return (
          <div>New Profile</div>
        );
    }
}
NewProfileForm.propTypes = {
    tempProfileCreate: PropTypes.func,
    tempProfileUpdate: PropTypes.func
};
export default NewProfileForm;
