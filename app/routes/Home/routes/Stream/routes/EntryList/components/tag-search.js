import React, { PropTypes, Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { AutoComplete, RaisedButton } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import { tagMessages } from 'locale-data/messages';
import debounce from 'lodash.debounce';

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
            typed: ''
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
            typed: slice
        });
        this.delayedReq();
    };

    handleSelect = (value) => {
        this.setState({
            typed: '',
            pendingTag: ''
        });
        const { selectTag } = this.props;
        selectTag(value);
    };

    handlePublishTag = () => {
        this.props.publishTag(this.state.pendingTag);
    };

    render () {
        const {
            tagName, tagEntriesCount, subscriptions, subscribeTag, unsubscribeTag,
            subscribePending, intl
        } = this.props;
        const isSubscribed = subscriptions && !!subscriptions.find(tag => tag.get('tagName') === tagName);
        const isPending = subscribePending && subscribePending.value;
        return (<div className="row" style={{ paddingBottom: 24, width: '640px' }} >
          <div className="col-xs-12" style={{ position: 'relative', padding: 0 }} >
            <AutoComplete
              fullWidth
              hintText="Search another tag"
              floatingLabelText={`tagged in [ ${tagName} ]`}
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleInputChange}
              onNewRequest={this.handleSelect}
              searchText={this.state.typed}
            />
            {!this.state.pendingTag && <RaisedButton
              label={isSubscribed ?
                        intl.formatMessage(tagMessages.unsubscribe) :
                        intl.formatMessage(tagMessages.subscribe)
                    }
              primary={!isSubscribed}
              style={buttonStyle}
              onClick={isSubscribed ? unsubscribeTag : subscribeTag}
              disabled={isPending}
            />}
            {this.state.pendingTag && <RaisedButton
              label={'Create tag'}
              primary
              style={buttonStyle}
              onClick={this.handlePublishTag}
              icon={<AddIcon />}
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
    subscribePending: PropTypes.shape()
};
export default injectIntl(TagSearch);
