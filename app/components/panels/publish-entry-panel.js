import React from 'react';
import { Paper, TextField, RaisedButton } from 'material-ui';
import ImageUploader from '../ui/image-uploader/image-uploader';
import LicenceDialog from '../ui/dialogs/licence-dialog';
import TagsField from '../ui/tags-field/tags-field';
import licences from '../ui/dialogs/licences';
import { convertFromRaw } from 'draft-js';

class PublishPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLicencingOpen: false
        };
    }
    componentWillMount () {
        if (this.props.draft.id) {
            this.setWorkingDraft(this.props.draft);
        }
    }
    componentDidMount () {}
    componentWillReceiveProps (nextProps) {
        const { entryState, params } = nextProps;

        if (entryState.get('drafts') !== this.props.entryState.get('drafts')) {
            const draft = entryState.get('drafts').find(drft =>
                drft.id === parseInt(params.draftId, 10));
            this.setWorkingDraft(draft);
        }
    }
    setWorkingDraft = (draft) => {
        const { title, content, tags, licence, featuredImage } = draft;
        let { excerpt } = draft;
        if (!excerpt) {
            excerpt = convertFromRaw(content).getPlainText()
                                             .slice(0, 120)
                                             .replace(/\r?\n|\r/g, ' ');
        }
        this.setState({
            title,
            content,
            excerpt,
            tags,
            licence,
            featuredImage
        });
    }
    _handleLicenceDialogClose = (ev) => {
        this.setState({
            isLicencingOpen: false
        });
    }
    _handleLicenceFocus = (ev) => {
        this.setState({
            isLicencingOpen: true
        });
    }
    _handleLicenceSet = (ev, selectedLicence) => {
        this.setState({
            selectedLicence,
            isLicencingOpen: false
        });
    }
    _handleScroll = (ev) => {
        const scrollTop = this.refs.panelContent.scrollTop;
        if (scrollTop > 0) {
            this.refs.panelTitle.style.boxShadow = '0px 3px 3px -1px rgba(0,0,0,0.2)';
            this.refs.panelTitle.style.height = 96 - (scrollTop / 2) + 'px';
        } else {
            this.refs.panelTitle.style.boxShadow = 'none';
        }
    }
    _publishEntry = () => {
        console.log(this.state);
    }
    _handleDeleteTag = (ev) => {

    }
    render () {
        let selectedLicence;
        if (this.state.selectedLicence) {
            selectedLicence = this.state.selectedLicence;
        } else {
            selectedLicence = {
                mainLicence: licences.find(lic => lic.id === '1'),
                subLicence: null,
                isDefault: false
            };
        }
        const licenceDescription = selectedLicence.mainLicence.description.map((descr, key) => {
            return (
              <span key={key}>{descr.text}</span>
            );
        });
        return (
          <Paper
            style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: '-320px',
                bottom: 0,
                width: (this.props.width || 640),
                zIndex: 10,
                height: '100%',
            }}
          >
            <LicenceDialog
              isOpen={this.state.isLicencingOpen}
              defaultSelected="1"
              onRequestClose={this._handleLicenceDialogClose}
              onDone={this._handleLicenceSet}
              licences={licences}
            />
            <div className="col-xs-12">
              <div
                className="row middle-xs"
                ref="panelTitle"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    minHeight: 64,
                    height: 96,
                    padding: '12px 24px',
                    background: '#FFF',
                    margin: 0,
                    zIndex: 10,
                    transition: 'all 0.318s ease-in-out'
                }}
              >
                <h2 className="col-xs-7">Publish a New Entry</h2>
                <div className="col-xs-4 end-xs">0.002 ETH</div>
              </div>
              <div
                className="row"
                style={{
                    position: 'absolute',
                    top: 64,
                    bottom: 64,
                    left: 0,
                    right: 0,
                    overflowY: 'auto',
                    overFlowX: 'hidden',
                    padding: '24px',
                    margin: 0
                }}
                ref="panelContent"
                onScroll={this._handleScroll}
              >
                <div className="col-xs-12 field">
                  <small>Title shown in preview</small>
                  <TextField name="title" fullWidth value={this.state.title} />
                </div>
                <div className="col-xs-12 field">
                  <small>Featured Image</small>
                  <ImageUploader />
                </div>
                <div className="col-xs-12 field">
                  <small>Tags</small>
                  <TagsField tags={this.state.tags} fullWidth />
                </div>
                <div className="col-xs-12 field">
                  <small>Excerpt shown in preview</small>
                  <TextField
                    name="excerpt"
                    multiLine
                    fullWidth
                    value={this.state.excerpt}
                    onChange={(ev) => this.setState({ excerpt: ev.target.value })}
                  />
                </div>
                <div className="col-xs-12 field">
                  <small>Licence</small>
                  <TextField
                    name="licence"
                    fullWidth
                    onFocus={this._handleLicenceFocus}
                    errorText={licenceDescription}
                    errorStyle={{ color: '#DDD' }}
                    value={selectedLicence.mainLicence.label}
                  />
                </div>
                <div className="col-xs-12 field">
                  <small>
                  By proceeding to publish this entry, you agree with the
                    <b> 0.005 ETH</b> fee which will be deducted from your
                    <b> 0.02 ETH</b> balance.
                  </small>
                </div>
              </div>
              <div
                className="row end-xs"
                ref="panelActions"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 24px',
                    background: '#FFF',
                    margin: 0,
                    boxShadow: '0px -1px 3px -1px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="col-xs-2">
                  <RaisedButton label="Later" />
                </div>
                <div className="col-xs-2">
                  <RaisedButton label="Publish" primary onTouchTap={this._publishEntry} />
                </div>
              </div>
            </div>
          </Paper>
        );
    }
}
PublishPanel.propTypes = {
    width: React.PropTypes.string,
    entryState: React.PropTypes.object
};
export default PublishPanel;
