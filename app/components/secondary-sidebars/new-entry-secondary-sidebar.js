import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';
import fuzzy from 'fuzzy';
import { injectIntl } from 'react-intl';
import { entryMessages } from '../../locale-data/messages';
import { selectLoggedAkashaId } from '../../local-flux/selectors';
import { draftsGetCount, draftsGet, draftDelete } from '../../local-flux/actions/draft-actions';

class NewEntrySecondarySidebar extends Component {
    state = {
        searchString: ''
    };

    componentDidMount () {
        const { akashaId } = this.props;
        this.props.draftsGetCount({ akashaId });
    }
    componentWillReceiveProps (nextProps) {
        const { draftsFetched, draftsCount } = nextProps;
        const { akashaId } = this.props;
        if (!draftsFetched && (draftsCount > 0)) {
            this.props.draftsGet({ akashaId });
        }
    }
    _onDraftItemClick = draftPath =>
        (ev) => {
            ev.preventDefault();
            const { history } = this.props;
            history.push(draftPath);
        }
    _handleDraftDelete = draftId =>
        (ev) => {
            const { akashaId } = this.props;
            // prevent default just in case some other dev decides to
            // use <a> tag instead <div>
            if (ev) ev.preventDefault();
            this.props.draftDelete({ draftId, akashaId });
        }
    _handleDraftSearch = (ev) => {
        ev.preventDefault();
        const searchString = ev.target.value;
        if (searchString.length) {
            return this.setState({
                searchString,
                searching: true
            });
        }
        return this.setState({
            searchString,
            searching: false
        });
    }
    _createDraftPreviewLink = draftId =>
        (ev) => {
            // prevent default just in case some other dev decides to
            // use <a> tag instead <div>
            if (ev) ev.preventDefault();

            // @TODO this feature is not planned for 0.6 release;
            console.log('create a preview link for draft', draftId);
            // this.props.createDraftPreviewLink()
        }
    render () {
        const { draftsCount, drafts, match, intl } = this.props;
        const currentDraftId = match.params.draftId;
        const searchOptions = {
            pre: '<b>',
            post: '</b>',
            extract: el => el.content.title,
        };
        const results = fuzzy.filter(this.state.searchString, drafts.toList().toJS(), searchOptions);

        return (
          <div
            className="new-entry-secondary-sidebar"
          >
            <div
              className="new-entry-secondary-sidebar__sidebar-header"
            >
              {intl.formatMessage(entryMessages.draftsCount, { count: draftsCount })}
            </div>
            <div
              className="new-entry-secondary-sidebar__sidebar-body"
            >
              <div
                className="new-entry-secondary-sidebar__search-container"
              >
                <input
                  type="text"
                  className="new-entry-secondary-sidebar__search-field"
                  placeholder={intl.formatMessage(entryMessages.searchSomething)}
                  onChange={this._handleDraftSearch}
                />
              </div>
              <div
                className="new-entry-secondary-sidebar__draft-list-container"
              >
                <div className="new-entry-secondary-sidebar__draft-list-title">
                  {intl.formatMessage(entryMessages.drafts)}
                </div>
                {this.state.searching && (results.length > 0) &&
                    results.map(draft => (
                      <div
                        key={`${draft.original.id}`}
                        className={
                            `new-entry-secondary-sidebar__draft-list-item
                            new-entry-secondary-sidebar__draft-list-item${
                            (draft.original.id === currentDraftId) ? '_active' : ''
                        }`}
                      >
                        {/* eslint-disable react/no-danger */}
                        <a
                          href="/"
                          dangerouslySetInnerHTML={{ __html: draft.string }}
                          className="draft-list-item__link"
                          onClick={
                            this._onDraftItemClick(
                              `/draft/${draft.original.content.type}/${draft.original.id}`
                            )
                          }
                        />
                        {/* eslint-enable react/no-danger */}
                        <span
                          className="draft-list-item__menu-container"
                        >
                          <Popover
                            placement="bottomLeft"
                            overlayClassName="draft-list-item__popover"
                            content={
                              <div>
                                {(draft.original.id !== currentDraftId) &&
                                <div
                                  className="draft-list-item__popover-button"
                                  onClick={
                                    this._onDraftItemClick(
                                      `/draft/${draft.original.content.type}/${draft.original.id}`
                                    )
                                  }
                                >
                                  <b>{intl.formatMessage(entryMessages.draftEdit)}</b>
                                </div>
                                }
                                <div
                                  className="draft-list-item__popover-button"
                                  onClick={this._createDraftPreviewLink(draft.original.id)}
                                >
                                  <b>{intl.formatMessage(entryMessages.draftSharePreview)}</b>
                                </div>
                                <div
                                  className="draft-list-item__popover-button"
                                  onClick={this._handleDraftDelete(draft.original.id)}
                                >
                                  <b>{intl.formatMessage(entryMessages.draftDelete)}</b>
                                </div>
                              </div>
                            }
                            trigger="click"
                          >
                            <Icon
                              className="draft-list-item__menu-button"
                              type="ellipsis"
                              onClick={this._showDraftMenuDropdown}
                            />
                          </Popover>
                        </span>
                      </div>
                    ))
                }
                {this.state.searching && results.length === 0 &&
                  <div>No drafts matching your search criteria were found.</div>
                }
                {!this.state.searching && drafts.map(draft => (
                  <div
                    className={
                        `new-entry-secondary-sidebar__draft-list-item
                        new-entry-secondary-sidebar__draft-list-item${
                            (draft.get('id') === currentDraftId) ? '_active' : ''
                        }`
                    }
                    key={`${draft.get('id')}`}
                  >
                    <a
                      href="/"
                      className="draft-list-item__link"
                      onClick={
                          this._onDraftItemClick(
                              `/draft/${draft.getIn(['content', 'type'])}/${draft.get('id')}`
                          )
                      }
                    >
                      { draft.getIn(['content', 'title']) || 'No title' }
                    </a>
                    <span
                      className="draft-list-item__menu-container"
                    >
                      <Popover
                        placement="bottomLeft"
                        arrowPointAtCenter
                        overlayClassName="draft-list-item__popover"
                        content={
                          <div>
                            {(draft.get('id') !== currentDraftId) &&
                              <div
                                className="draft-list-item__popover-button"
                                onClick={
                                    this._onDraftItemClick(
                                        `/draft/${draft.getIn(['content', 'type'])}/${draft.get('id')}`
                                    )
                                }
                              >
                                <b>{intl.formatMessage(entryMessages.draftEdit)}</b>
                              </div>
                            }
                            <div
                              className="draft-list-item__popover-button"
                              onClick={this._createDraftPreviewLink(draft.get('id'))}
                            >
                              <b>{intl.formatMessage(entryMessages.draftSharePreview)}</b>
                            </div>
                            <div
                              className="draft-list-item__popover-button"
                              onClick={this._handleDraftDelete(draft.get('id'))}
                            >
                              <b>{intl.formatMessage(entryMessages.draftDelete)}</b>
                            </div>
                          </div>
                        }
                        trigger="click"
                      >
                        <Icon
                          className="draft-list-item__menu-button"
                          type="ellipsis"
                          onClick={this._showDraftMenuDropdown}
                        />
                      </Popover>
                    </span>
                  </div>
                )).toList()}
              </div>
            </div>
          </div>
        );
    }
}
NewEntrySecondarySidebar.propTypes = {
    akashaId: PropTypes.string,
    draftsCount: PropTypes.number,
    draftDelete: PropTypes.func,
    draftsFetched: PropTypes.bool,
    drafts: PropTypes.shape(),
    draftsGet: PropTypes.func,
    draftsGetCount: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    match: PropTypes.shape(),
};
const mapStateToProps = state => ({
    draftsCount: state.draftState.get('draftsCount'),
    akashaId: selectLoggedAkashaId(state),
    draftsFetched: state.draftState.get('draftsFetched'),
    drafts: state.draftState.get('drafts'),
});

export default connect(
    mapStateToProps,
    {
        draftDelete,
        draftsGetCount,
        draftsGet,
    }
)(injectIntl(NewEntrySecondarySidebar));
