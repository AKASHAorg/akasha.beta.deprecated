import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Input } from 'antd';
import uniq from 'lodash/uniq';
import { HighlightCard } from '../';
import { searchMessages } from '../../locale-data/messages';
import { highlightDelete, highlightEditNotes, highlightSearch,
    highlightToggleNoteEditable } from '../../local-flux/actions/highlight-actions';
import { profileGetList } from '../../local-flux/actions/profile-actions';
import { ProfileRecord } from '../../local-flux/reducers/records';
import { selectHighlights, selectHighlightSearch } from '../../local-flux/selectors';

class Highlights extends Component {
    componentDidMount () {
        const { highlights } = this.props;
        const ethAddresses = uniq(highlights.map(highlight =>
            ({ ethAddress: highlight.get('publisher') })));
        this.props.profileGetList(ethAddresses.toJS());
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
        const { intl, highlights, profiles, search } = this.props;

        return (
          <div className="highlights">
            <div className="highlights__content" ref={this.getContainerRef}>
              <div className="highlights__search">
                <Input
                  onChange={this.onSearchChange}
                  value={search}
                  size="large"
                  placeholder={intl.formatMessage(searchMessages.searchSomething)}
                  prefix={<Icon type="search" />}
                />
              </div>
              {highlights.map((highlight) => {
                //   console.log('profiles: ', profiles.toJS(), 'publisherEth: ', highlight.get('publisher'));
                //   console.log('get profile info: ', profiles.get(highlight.get('publisher')));
                  const publisher = profiles.get(highlight.get('publisher')) || new ProfileRecord();
                  return (
                    <HighlightCard
                      containerRef={this.container}
                      deleteHighlight={this.props.highlightDelete}
                      editNotes={this.props.highlightEditNotes}
                      toggleNoteEditable={this.props.highlightToggleNoteEditable}
                      highlight={highlight}
                      key={highlight.get('id')}
                      publisher={publisher}
                    />
                  );
              })}
            </div>
          </div>
        );
    }
}

Highlights.propTypes = {
    highlightDelete: PropTypes.func.isRequired,
    highlightEditNotes: PropTypes.func.isRequired,
    highlights: PropTypes.shape(),
    highlightSearch: PropTypes.func,
    highlightToggleNoteEditable: PropTypes.func,
    intl: PropTypes.shape(),
    profileGetList: PropTypes.func.isRequired,
    profiles: PropTypes.shape().isRequired,
    search: PropTypes.string
};

function mapStateToProps (state) {
    return {
        highlights: selectHighlights(state),
        profiles: state.profileState.get('byEthAddress'),
        search: selectHighlightSearch(state),
    };
}

export default connect(
    mapStateToProps,
    {
        highlightDelete,
        highlightEditNotes,
        highlightSearch,
        profileGetList,
        highlightToggleNoteEditable
    }
)(injectIntl(Highlights));
