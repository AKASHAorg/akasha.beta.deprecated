import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { FlatButton, SvgIcon } from 'material-ui';
import LeftArrow from 'material-ui/svg-icons/navigation/chevron-left';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';

const NewColumnFooter = (props, { muiTheme }) => (
  <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px' }}>
    <FlatButton
      icon={<SvgIcon><LeftArrow /></SvgIcon>}
      label={props.intl.formatMessage(generalMessages.back)}
      labelStyle={{ height: '100%', display: 'inline-flex', alignItems: 'center' }}
      onClick={props.onBack}
      style={{ flex: '0 0 auto' }}
    />
    <FlatButton
      label={props.intl.formatMessage(dashboardMessages.addColumn)}
      onClick={props.onAdd}
      style={{ flex: '0 0 auto', border: `2px solid ${muiTheme.palette.borderColor}` }}
    />
  </div>
);

NewColumnFooter.contextTypes = {
    muiTheme: PropTypes.shape()
};

NewColumnFooter.propTypes = {
    intl: PropTypes.shape(),
    onAdd: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

export default injectIntl(NewColumnFooter);
