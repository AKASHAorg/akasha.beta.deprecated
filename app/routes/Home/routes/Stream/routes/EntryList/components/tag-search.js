import React, { PropTypes } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextField, RaisedButton, SelectField, MenuItem } from 'material-ui';
import { tagMessages } from 'locale-data/messages';

const buttonStyle = {
    height: 34,
    position: 'absolute',
    right: 8,
    top: 25
};
const TagSearch = (props) => {
  const { tagName, tagEntriesCount, subscriptions, subscribeTag, unsubscribeTag,
      subscribePending, intl } = props;
  const isSubscribed = subscriptions && !!subscriptions.find(tag => tag.get('tagName') === tagName);
  const isPending = subscribePending && subscribePending.value;
  return <div className="row" style={{ paddingBottom: 24 }}>
    <div className="col-xs-12" style={{ position: 'relative' }}>
      <TextField
        fullWidth
        hintText="Type a tag"
        floatingLabelText="TAGGED IN"
        value={tagName.toUpperCase()}
      />
      <RaisedButton
        label={isSubscribed ?
            intl.formatMessage(tagMessages.unsubscribe) :
            intl.formatMessage(tagMessages.subscribe)
        }
        primary={!isSubscribed}
        style={buttonStyle}
        onClick={isSubscribed ? unsubscribeTag : subscribeTag}
        disabled={isPending}
      />
    </div>
    <div
      className="col-xs-12"
      style={{
          display: 'flex', justifyContent: 'space-between', paddingTop: '10px'
      }}
    >
      <div>
        <FormattedMessage
          id="app.profile.entriesCount"
          description="counting a profile's entries"
          defaultMessage={`{entriesCount, number} {entriesCount, plural,
                one {entry}
                few {entries}
                many {entries}
                other {entries}
              }`}
          values={{ entriesCount: tagEntriesCount.get('count') }}
        />
      </div>
      <div>Sorted by latest</div>
    </div>
  </div>;
}

TagSearch.propTypes = {
    tagName: PropTypes.string,
    tagEntriesCount: PropTypes.shape(),
    subscriptions: PropTypes.shape(),
    subscribeTag: PropTypes.func,
    unsubscribeTag: PropTypes.func,
    subscribePending: PropTypes.shape()
};
export default injectIntl(TagSearch);
