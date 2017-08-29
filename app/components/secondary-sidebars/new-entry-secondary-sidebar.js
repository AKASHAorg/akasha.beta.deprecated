import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectLoggedAkashaId } from '../../local-flux/selectors';
import { draftsGetCount, draftsGet } from '../../local-flux/actions/draft-actions';

class NewEntrySecondarySidebar extends Component {
    componentDidMount () {
        const { akashaId } = this.props;
        this.props.draftsGetCount({ akashaId });
    }
    componentWillReceiveProps (nextProps) {
        const { draftsCount } = nextProps;
        if (draftsCount > 0) {
            this.props.draftsGet({ akashaId: this.props.akashaId });
        }
    }
    render () {
        const { draftsCount } = this.props;
        return (
          <div>
            {draftsCount} drafts
          </div>
        );
    }
}
NewEntrySecondarySidebar.propTypes = {
    akashaId: PropTypes.string,
    draftsCount: PropTypes.number,
    draftsGet: PropTypes.func,
    draftsGetCount: PropTypes.func,
};
const mapStateToProps = state => ({
    draftsCount: state.draftState.get('draftsCount'),
    akashaId: selectLoggedAkashaId(state)
});

export default connect(
    mapStateToProps,
    {
        draftsGetCount,
        draftsGet,
    }
)(NewEntrySecondarySidebar);
