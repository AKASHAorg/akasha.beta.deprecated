import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectLoggedAkashaId } from '../../local-flux/selectors';
import { draftsGetCount, draftsGet } from '../../local-flux/actions/draft-actions';

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
    render () {
        const { draftsCount, drafts } = this.props;
        return (
          <div>
            <div>{draftsCount} drafts</div>
            <div>
              <div
                className="new-entry-secondary-sidebar__search-container"
              >
                  Search
              </div>
              <div
                className="new-entry-secondary-sidebar__draft-list-container"
              >
                {drafts.map(draft =>
                  <div className="draft-list-item" key={`${draft.get('id')}`}>
                    <a
                      href="#"
                      onClick={
                          this._onDraftItemClick(
                              `/draft/${draft.getIn(['content', 'type'])}/${draft.get('id')}`
                          )
                      }
                    >
                      { draft.getIn(['content', 'title']) || 'No title' }
                    </a>
                    <span>
                        :
                    </span>
                  </div>
                ).toList()}
              </div>
            </div>
          </div>
        );
    }
}
NewEntrySecondarySidebar.propTypes = {
    akashaId: PropTypes.string,
    draftsCount: PropTypes.number,
    draftsFetched: PropTypes.bool,
    drafts: PropTypes.shape(),
    draftsGet: PropTypes.func,
    draftsGetCount: PropTypes.func,
    history: PropTypes.shape(),
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
        draftsGetCount,
        draftsGet,
    }
)(NewEntrySecondarySidebar);
