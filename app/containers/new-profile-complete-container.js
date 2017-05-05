import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { NewProfileComplete } from '../components';
import { tempProfileGetRequest, tempProfileDelete } from '../local-flux/actions/temp-profile-actions';

function mapStateToProps (state) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileGetRequest,
        tempProfileDelete,
    }
)(injectIntl(NewProfileComplete));
