import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { CardHeader, CircularProgress, Divider, FlatButton, IconButton, SvgIcon } from 'material-ui';
import { DraftJS, MegadraftEditor, editorStateFromRaw, createTypeStrategy } from 'megadraft';
import Link from 'megadraft/lib/components/Link';
import MoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import LessIcon from 'material-ui/svg-icons/navigation/expand-less';
import { MentionDecorators } from '../../shared-components';
import { Avatar, ProfileHoverCard } from '../';
import { getInitials } from '../../utils/dataModule';
import style from './comment.scss';

const { CompositeDecorator, EditorState } = DraftJS;

class OptimisticComment extends Component {
    constructor (props) {
        super(props);

        const decorators = new CompositeDecorator([MentionDecorators.nonEditableDecorator, {
            strategy: createTypeStrategy('LINK'),
            component: Link
        }]);
        this.editorState = EditorState.createEmpty(decorators);
        this.state = {
            isExpanded: null,
            anchorHovered: false,
        };
        this.timeout = null;
    }

    componentDidMount () {
        let { isExpanded } = this.state;
        let contentHeight;
        if (this.editorWrapperRef) {
            contentHeight = this.editorWrapperRef.getBoundingClientRect().height;
        }
        if (contentHeight > 155) {
            isExpanded = false;
        }
        return this.setState({ // eslint-disable-line react/no-did-mount-set-state
            isExpanded
        });
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.state.anchorHovered && !prevState.anchorHovered) {
            ReactTooltip.rebuild();
        }
        if (!this.state.anchorHovered && prevState.anchorHovered) {
            ReactTooltip.hide();
        }
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    getExpandedStyle = () => {
        const { isExpanded } = this.state;
        if (isExpanded === false) {
            return { maxHeight: 155, overflow: 'hidden' };
        }
        if (isExpanded === true) {
            return { maxHeight: 'none', overflow: 'visible' };
        }
        return {};
    };

    handleMouseEnter = (ev) => {
        this.setState({
            hoverNode: ev.currentTarget
        });
        this.timeout = setTimeout(() => {
            this.setState({
                anchorHovered: true,
            });
        }, 500);
    };

    handleMouseLeave = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.setState({
            anchorHovered: false,
            hoverNode: null
        });
    };

    toggleExpanded = (ev, isExpanded) => {
        ev.preventDefault();
        this.setState({
            isExpanded
        });
    };

    render () {
        const { comment, intl, loggedProfileData } = this.props;
        const { palette } = this.context.muiTheme;
        const { isExpanded } = this.state;
        const { date, content } = comment.payload.toJS();
        const parsedContent = JSON.parse(content);
        const editorState = editorStateFromRaw(parsedContent).getCurrentContent();
        const akashaId = loggedProfileData.get('akashaId');
        const initials = getInitials(loggedProfileData.firstName, loggedProfileData.lastName);
        const avatar = loggedProfileData.get('avatar');

        return (
          <div className={style.root} style={{ position: 'relative' }}>
            <div className={style.rootInner}>
              <div className={`row ${style.commentHeader}`} style={{ marginBottom: 0 }}>
                <div className={`col-xs-5 ${style.commentAuthor}`}>
                  <CardHeader
                    avatar={
                      <Avatar
                        image={avatar}
                        onMouseEnter={this.handleMouseEnter}
                        size={40}
                        // onClick={ev => onAuthorNameClick(ev, profile.get('profile'))}
                        style={{ display: 'inline-block', cursor: 'pointer' }}
                        userInitials={initials}
                        userInitialsStyle={{ fontSize: '20px' }}
                      />
                    }
                    onMouseLeave={this.handleMouseLeave}
                    style={{ padding: 0 }}
                    subtitle={
                      <div>
                        {date && intl.formatRelative(new Date(date))}
                      </div>
                    }
                    subtitleStyle={{ paddingLeft: '2px', fontSize: '80%' }}
                    title={
                      <div
                        onMouseEnter={this.handleMouseEnter}
                        style={{ position: 'relative' }}
                      >
                        <FlatButton
                          className={`${style.viewer_is_author} ${style.author_name}`}
                          hoverColor="transparent"
                          label={akashaId}
                          labelStyle={{
                              textTransform: 'initial',
                              paddingLeft: 4,
                              paddingRight: 4,
                              color: palette.commentViewerIsAuthorColor
                          }}
                          // onClick={ev => onAuthorNameClick(ev, profile.get('profile'))}
                          style={{ height: 28, lineHeight: '28px', textAlign: 'left' }}
                        />
                      </div>
                    }
                    titleStyle={{ fontSize: '100%', height: 24 }}
                  >
                    <ProfileHoverCard
                      anchorHovered={this.state.anchorHovered}
                      profile={loggedProfileData.toJS()}
                      anchorNode={this.state.hoverNode}
                    />
                  </CardHeader>
                </div>
                <div className={'col-xs-7 end-xs'}>
                  <CircularProgress size={32} />
                </div>
              </div>
              <div
                ref={editorWrap => (this.editorWrapperRef = editorWrap)}
                className={`row ${style.commentBody}`}
                style={this.getExpandedStyle()}
              >
                <MegadraftEditor
                  readOnly
                  editorState={EditorState.push(this.editorState, editorState)}
                  sidebarRendererFn={() => null}
                />
              </div>
              {isExpanded !== null &&
                <div style={{ fontSize: 12, textAlign: 'center' }}>
                  {(isExpanded === false) &&
                    <IconButton onClick={ev => this.toggleExpanded(ev, true)}>
                      <SvgIcon>
                        <MoreIcon />
                      </SvgIcon>
                    </IconButton>
                  }
                  {isExpanded &&
                    <IconButton onClick={ev => this.toggleExpanded(ev, false)}>
                      <SvgIcon>
                        <LessIcon />
                      </SvgIcon>
                    </IconButton>
                  }
                </div>
              }
              <Divider />
            </div>
          </div>
        );
    }
}

OptimisticComment.contextTypes = {
    muiTheme: PropTypes.shape()
};

OptimisticComment.propTypes = {
    comment: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
};

export default injectIntl(OptimisticComment);
