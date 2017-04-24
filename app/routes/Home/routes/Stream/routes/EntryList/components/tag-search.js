import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { AutoComplete, IconButton, RaisedButton } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import SearchIcon from 'material-ui/svg-icons/action/search';
import { formMessages, tagMessages } from 'locale-data/messages';
import debounce from 'lodash.debounce';
import { validateTag } from 'utils/dataModule';

const buttonStyle = {
    height: 34,
    position: 'absolute',
    right: 8,
    top: 25
};
class TagSearch extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            pendingTag: this.props.tagName,
            typed: '',
            error: null
        };
        Channel.client.tags.searchTag.on(this.hydrateDataSource);
        Channel.client.tags.exists.on(this.checkTag);
    }

    componentWillUnmount () {
        Channel.client.tags.searchTag.removeListener(this.hydrateDataSource);
        Channel.client.tags.exists.removeListener(this.checkTag);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.tagName !== nextProps.tagName || this.state.pendingTag) {
            Channel.server.tags.exists.send({ tagName: nextProps.tagName });
        }
    }

    hydrateDataSource = (ev, result) => {
        this.setState({ dataSource: result.data.collection });
    };

    checkTag = (ev, result) => {
        this.setState({ pendingTag: (result.data.exists) ? '' : result.data.tagName });
    };

    delayedReq = debounce(() => {
        if (this.state.typed.length >= 3) {
            Channel.server.tags.searchTag.send({ tagName: this.state.typed, limit: 5 });
        }
    }, 210);

    handleInputChange = (slice) => {
        this.setState({
            typed: slice,
            error: null
        });
        this.delayedReq();
    };

    handleSelect = (value) => {
        const { intl, selectTag } = this.props;
        const error = validateTag(value);
        if (error) {
            const errorMessage = intl.formatMessage(formMessages[error]);
            return this.setState({
                error: errorMessage
            });
        }
        selectTag(value);
        this.setState({
            typed: '',
            pendingTag: ''
        });
    };

    handlePublishTag = () => {
        this.props.publishTag(this.state.pendingTag);
    };

    render () {
        const {
            tagName, tagEntriesCount, subscriptions, subscribeTag, unsubscribeTag,
            registerPending, subscribePending, intl
        } = this.props;
        const isSubscribed = subscriptions && !!subscriptions.find(tag => tag.get('tagName') === tagName);
        const isPending = subscribePending && subscribePending.value;
        return (<div className="row" style={{ paddingBottom: 24, width: '640px' }} >
          <div className="col-xs-12" style={{ position: 'relative', padding: 0, height: '72px' }} >
            <AutoComplete
              fullWidth
              hintText="Search another tag"
              floatingLabelText={`tagged in [ ${tagName} ]`}
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleInputChange}
              onNewRequest={this.handleSelect}
              searchText={this.state.typed}
              errorText={this.state.error}
            />
            {this.state.typed && <RaisedButton
              label={'Search'}
              primary
              style={buttonStyle}
              onClick={() => { this.handleSelect(this.state.typed); }}
              icon={<SearchIcon />}
            />
            }
            {!this.state.typed && !this.state.pendingTag && <RaisedButton
              label={isSubscribed ?
                        intl.formatMessage(tagMessages.unsubscribe) :
                        intl.formatMessage(tagMessages.subscribe)
                    }
              primary={!isSubscribed}
              style={buttonStyle}
              onClick={isSubscribed ? unsubscribeTag : subscribeTag}
              disabled={isPending}
            />}
            {!this.state.typed && this.state.pendingTag && <RaisedButton
              label={'Create'}
              primary
              style={buttonStyle}
              onClick={this.handlePublishTag}
              icon={<AddIcon />}
              disabled={registerPending && registerPending.value}
            />}
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
        </div>);
    }
}

TagSearch.propTypes = {
    tagName: PropTypes.string,
    tagEntriesCount: PropTypes.shape(),
    subscriptions: PropTypes.shape(),
    subscribeTag: PropTypes.func,
    unsubscribeTag: PropTypes.func,
    selectTag: PropTypes.func,
    publishTag: PropTypes.func,
    registerPending: PropTypes.shape(),
    subscribePending: PropTypes.shape()
};
export default injectIntl(TagSearch);
