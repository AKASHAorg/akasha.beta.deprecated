import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';
import { selectLoggedAkashaId } from '../../local-flux/selectors';
import { draftsGetCount, draftsGet, draftDelete } from '../../local-flux/actions/draft-actions';

class NewEntrySecondarySidebar extends Component {
    componentDidMount () {
        const { akashaId } = this.props;
        this.props.draftsGetCount({ akashaId });
    }
    componentWillReceiveProps (nextProps) {
        const { draftsFetched } = nextProps;
        const { akashaId } = this.props;
        if (!draftsFetched) {
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
        const { draftsCount, drafts, match } = this.props;
        const currentDraftId = match.params.draftId;

        return (
          <div
            className="new-entry-secondary-sidebar"
          >
            <div
              className="new-entry-secondary-sidebar__sidebar-header"
            >
              {draftsCount} DRAFTS
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
                  placeholder="Search something..."
                />
              </div>
              <div
                className="new-entry-secondary-sidebar__draft-list-container"
              >
                <div className="new-entry-secondary-sidebar__draft-list-title">DRAFTS</div>
                {drafts.map(draft => (
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
                                <b>Edit draft</b>
                              </div>
                            }
                            <div
                              className="draft-list-item__popover-button"
                              onClick={this._createDraftPreviewLink(draft.get('id'))}
                            >
                              <b>Share preview link</b>
                            </div>
                            <div
                              className="draft-list-item__popover-button"
                              onClick={this._handleDraftDelete(draft.get('id'))}
                            >
                              <b>Delete draft</b>
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
)(NewEntrySecondarySidebar);
