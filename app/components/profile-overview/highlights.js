import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Input } from 'antd';
import classNames from 'classnames';
import * as R from 'ramda';
import Masonry from 'react-masonry-component';
import { HighlightCard, Icon } from '../';
import { searchMessages } from '../../locale-data/messages';
import { highlightDelete, highlightEditNotes, highlightSearch,
    highlightToggleEditing, highlightToggleNoteEditable } from '../../local-flux/actions/highlight-actions';
import { profileGetList } from '../../local-flux/actions/profile-actions';
import { ProfileRecord } from '../../local-flux/reducers/records';
import { selectHighlights, selectHighlightsEditing, selectHighlightSearchTerm,
    selectProfilesByEthAddress } from '../../local-flux/selectors';

class Highlights extends Component {
    componentDidMount () {
        const { highlights } = this.props;
        const ethAddresses = highlights.map(highlight => ({ ethAddress: highlight.get('publisher') }));
        const payload = R.uniq(ethAddresses.toJS());
        if (payload.length) {
            this.props.profileGetList(payload);
        }
    }

    shouldComponentUpdate (nextProps) {
        const { highlights, profiles, search } = this.props;
        return (
            !highlights.equals(nextProps.highlights) ||
            !profiles.equals(nextProps.profiles) ||
            search !== nextProps.search
        );
    }

    getContainerRef = (el) => { this.container = el; };

    onSearchChange = (ev) => {
        this.props.highlightSearch(ev.target.value);
    };

    render () {
        const { editing, intl, highlights, profiles, search } = this.props;

        return (
          <div className="highlights__wrap">
            <div className="highlights">
              <div className="highlights__content" ref={this.getContainerRef}>
                <div className={classNames('highlights__search',
                    { highlights__search_editing: editing })}
                >
                  <Input
                    onChange={this.onSearchChange}
                    value={search}
                    size="large"
                    placeholder={intl.formatMessage(searchMessages.searchSomething)}
                    prefix={<Icon type="search" />}
                  />
                </div>
                <div className="highlights__cards-wrap">
                  <Masonry
                    options={{
                        transitionDuration: 0,
                        fitWidth: true
                    }}
                    style={{ margin: '0 auto' }}
                  >
                    {highlights.map((highlight) => {
                        const publisher = profiles.get(highlight.get('publisher')) || new ProfileRecord();
                        return (
                          <HighlightCard
                            containerRef={this.container}
                            deleteHighlight={this.props.highlightDelete}
                            editNotes={this.props.highlightEditNotes}
                            editing={editing}
                            toggleEditing={this.props.highlightToggleEditing}
                            toggleNoteEditable={this.props.highlightToggleNoteEditable}
                            highlight={highlight}
                            key={highlight.get('id')}
                            publisher={publisher}
                          />
                        );
                    })}
                  </Masonry>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

Highlights.propTypes = {
    editing: PropTypes.string,
    highlightDelete: PropTypes.func.isRequired,
    highlightEditNotes: PropTypes.func.isRequired,
    highlights: PropTypes.shape(),
    highlightSearch: PropTypes.func,
    highlightToggleEditing: PropTypes.func,
    highlightToggleNoteEditable: PropTypes.func,
    intl: PropTypes.shape(),
    profileGetList: PropTypes.func.isRequired,
    profiles: PropTypes.shape().isRequired,
    search: PropTypes.string
};

function mapStateToProps (state) {
    return {
        editing: selectHighlightsEditing(state),
        highlights: selectHighlights(state),
        profiles: selectProfilesByEthAddress(state),
        search: selectHighlightSearchTerm(state),
    };
}

export default connect(
    mapStateToProps,
    {
        highlightDelete,
        highlightEditNotes,
        highlightSearch,
        profileGetList,
        highlightToggleEditing,
        highlightToggleNoteEditable
    }
)(injectIntl(Highlights));
