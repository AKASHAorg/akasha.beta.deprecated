import React from 'react';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { TagService } from 'local-flux/services';

class PublishTags extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            tagsToPublish: []
        };
    }
    componentWillMount () {
        const { profileState, tagActions, entryState, params} = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        const draft = entryState.get('drafts').find(drft =>
            drft.id === parseInt(params.draftId, 10));
        this._getExistingTags(draft.get('tags')).then(existingTags => {
            const tagsToPublish = draft.get('tags').filter(tag =>
                existingTags.indexOf(tag) === -1);
            this.setState({
                tagsToPublish
            });
            tagActions.registerTags({
                tags: tagsToPublish,
                account: loggedProfile.get('address'),
                password: 'asdasdasd'
            }).catch(reason => {
                this.setState({
                    error: reason.message
                });
            });
        });
    }
    componentWillReceiveProps (nextProps) {
        const { entryState, params } = nextProps;
        const draft = entryState.get('drafts').find(drft =>
            drft.id === parseInt(params.draftId, 10));
        this._getExistingTags(draft.get('tags')).then(existingTags => {
            const tagsToPublish = draft.get('tags').filter(tag =>
                existingTags.indexOf(tag) === -1);
            if (tagsToPublish.length === 0) {
                this.context.router.push(
                    `/${params.akashaId}/draft/${params.draftId}/publish-status`
                );
            }
        });
    }

    _getExistingTags = (tags) => {
        const tagService = new TagService();
        return tagService.checkExistingTags(tags).then(results => {
            return results.map(tag => {
                if (tag[0] && tag[0].tag) {
                    return tag[0].tag;
                }
                return null;
            }).filter(tag => tag !== null);
        });
    };
    render () {
        return (
          <PanelContainer
            showBorder
            title="Publishing new tags"
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'absolute',
                top: 0,
                bottom: 0
            }}
          >
            <div className="col-xs-12">
              <div className="row center-xs">
                <div className="col-xs-12">Publishing tags:</div>
                {this.state.tagsToPublish.map((tag, key) =>
                  <span key={key} className="col-xs-3">{tag}</span>
                )}
                <div className="col-xs-12">Please wait</div>
              </div>
            </div>
            {this.state.error &&
                <div>{this.state.error}</div>
            }
          </PanelContainer>
        );
    }
}
PublishTags.propTypes = {};
PublishTags.contextTypes = {
    router: React.PropTypes.object
};
export default PublishTags;
