import React from 'react';
import { Subheader, Chip, FlatButton } from 'material-ui';

class StreamSidebar extends React.Component {
    constructor (props) {
        super (props);
    }
    _handleTagNavigation = (ev, tag) => {
        this.context.router.push(`/${this.props.params.username}/explore/tag/${tag}`);
    }
    render () {
        const tagStyle = {
            display: 'inline-block',
            border: '1px solid',
            borderColor: '#DDD',
            backgroundColor: '#FFF',
            borderRadius: 3,
            height: 34,
            verticalAlign: 'middle',
            marginRight: '4px',
            marginBottom: '4px',
            cursor: 'pointer'
        };
        const followedTags = [
            'mathematics',
            'blockchain',
            'movies',
            'sports',
            'moon',
            'short-story'
        ];
        const recommendedTags = [
            'mathematics',
            'blockchain',
            'movies',
            'sports',
            'moon',
        ];
        return (
          <div
            className="row center-xs"
            style={{
                background: '#F5F5F5',
                position: 'fixed',
                top: 45,
                bottom: 0
            }}
          >
            <div className="col-xs-12">
              <Subheader className="row start-xs middle-xs">
                <small
                  className="start-xs col-xs-8"
                >
                    FOLLOWED TAGS
                </small>
                <div className="col-xs-4 end-xs">
                  <FlatButton>
                    <small>+ADD NEW</small>
                  </FlatButton>
                </div>
              </Subheader>
              <div className="start-xs" style={{ paddingLeft: 16 }}>
                {followedTags.map((tag, key) =>
                  <Chip
                    key={key}
                    style={tagStyle}
                    onTouchTap={(ev) => this._handleTagNavigation(ev, tag)}
                  >
                    {tag}
                  </Chip>
                )}
              </div>
              <Subheader className="start-xs row">
                <small className="start-xs col-xs-8">RECOMMENDED TAGS</small>
              </Subheader>
              <div className="start-xs" style={{ paddingLeft: 16 }}>
                {recommendedTags.map((tag, key) =>
                  <Chip
                    key={key}
                    style={tagStyle}
                    onTouchTap={(ev) => this._handleTagNavigation(ev, tag)}
                  >
                    {tag}
                  </Chip>
                )}
              </div>
            </div>
          </div>
        );
    }
}

StreamSidebar.propTypes = {
    params: React.PropTypes.object
};

StreamSidebar.contextTypes = {
    router: React.PropTypes.object
};

export default StreamSidebar;
