import { connect } from 'react-redux';
import CreateProfile from './components/CreateProfile';
import { tempProfileCreate, tempProfileDelete } from 'local-flux/actions/temp-profile-actions';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileCreate,
        tempProfileDelete
    }
)(CreateProfile);
