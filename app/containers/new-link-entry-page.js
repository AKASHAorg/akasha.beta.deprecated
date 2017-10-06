import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { selectDraftById, selectLoggedAkashaId } from '../local-flux/selectors';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { extractWebsiteInfo } from '../utils/extract-website-info';
import { actionAdd } from '../local-flux/actions/action-actions';

window.__extractWebsiteInfo = extractWebsiteInfo;
class NewLinkEntryPage extends Component {
    render () {
        return (
          <div className="new-link-entry-page">
            Link Entry Editor!!
          </div>
        );
    }
}

NewLinkEntryPage.propTypes = {
    actionAdd: PropTypes.func,
    akashaId: PropTypes.string,
    baseUrl: PropTypes.string,
    draftObj: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftsFetched: PropTypes.bool,
    entriesFetched: PropTypes.bool,
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
    match: PropTypes.shape(),
    resolvingHashes: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
    searchResetResults: PropTypes.func,
    tagSearch: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicence: PropTypes.shape(),

};
const mapStateToProps = (state, ownProps) => ({
    akashaId: selectLoggedAkashaId(state),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    resolvingHashes: state.draftState.get('resolvingHashes'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('resultsCount'),
    userDefaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicence'])
});

export default connect(
    mapStateToProps,
    {
        actionAdd
    }
)(injectIntl(NewLinkEntryPage));
