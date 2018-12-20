import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { secondarySidebarToggle } from '../../local-flux/actions/app-actions';
import { selectShowSecondarySidebar } from '../../local-flux/selectors';

const NewEntryTopBar = props => (
  <div className="new-entry-top-bar">
    <div className="new-entry-top-bar__inner">
      <Button
        icon={props.showSecondarySidebar ? 'double-left' : 'double-right'}
        onClick={props.secondarySidebarToggle}
      />
    </div>
  </div>
);

NewEntryTopBar.propTypes = {
    secondarySidebarToggle: PropTypes.func,
    showSecondarySidebar: PropTypes.bool,
};

function mapStateToProps (state) {
    return {
        showSecondarySidebar: selectShowSecondarySidebar(state),
    };
}

export default connect(
    mapStateToProps,
    {
        secondarySidebarToggle
    }
)(NewEntryTopBar);
