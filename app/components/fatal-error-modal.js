import PropTypes from 'prop-types';
import React from 'react';
import { Dialog, RaisedButton } from 'material-ui';
import { errorMessages, generalMessages } from '../locale-data/messages';

const FatalErrorModal = ({ deleteError, error, intl }) => {
    const message = error.get('messageId') ?
        intl.formatMessage(errorMessages[error.get('messageId')]) :
        error.get('message');
    return (
      <Dialog
        actions={[
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.ok)}
            primary
            onTouchTap={() => deleteError(error.get('id'))}
          />
        ]}
        contentStyle={{ maxWidth: 300 }}
        title={intl.formatMessage(errorMessages.fatalError)}
        titleStyle={{ overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        open
        modal
      >
        {message}
      </Dialog>
    );
};

FatalErrorModal.propTypes = {
    deleteError: PropTypes.func,
    error: PropTypes.shape(),
    intl: PropTypes.shape(),
};

export default FatalErrorModal;
