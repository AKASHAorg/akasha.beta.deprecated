import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { selectFullEntry, selectLoggedEthAddress, selectLoggedAkashaId } from '../../local-flux/selectors';
import { getBreadcrumbs } from '../../utils/url-utils';
import { PanelLink } from '../';

const Breadcrumbs = (props) => {
    const { location, loginName, match, panel, paramsMapping } = props;
    const { parts, routes } = getBreadcrumbs(location.pathname, panel);

    // Replace an url parameter with its corresponding value in the breadcrumb
    // Eg: entryId => entry title
    // If a new mapping is needed, add it in mapStateToProps below
    Object.keys(paramsMapping).forEach((key) => {
        const param = match.params[key];
        if (param && parts.includes(param)) {
            const index = parts.indexOf(match.params[key]);
            const paramValue = parts[index];
            parts[index] = paramsMapping[key][paramValue];
        }
    });

    const beautifyName = (name) => {
        switch (name) {
            case 'editProfile':
                return 'Edit Profile';
            case 'lists':
                return 'Lists';
            case 'highlights':
                return 'Highlights';
            case 'settings':
                return 'Settings';
            case 'uprofile':
                return loginName;
            default:
                return name;
        }
    };

    return (
      <div className="flex-center-y breadcrumbs">
        {parts.map((part, index) => {
            const isLast = index === parts.length - 1;
            const className = classNames('breadcrumbs__part', {
                breadcrumbs__part_last: isLast
            });
            const breadcrumb = (
              <span className={className}>
                {beautifyName(part)}
              </span>
            );

            return (
              <span key={routes[index]}>
                {panel ?
                  <PanelLink to={routes[index]}>
                    {breadcrumb}
                  </PanelLink> :
                  <Link className="unstyled-link" to={routes[index]}>
                    {breadcrumb}
                  </Link>
                }
                {!isLast &&
                  <span className="breadcrumbs__separator">
                    {'>'}
                  </span>
                }
              </span>
            );
        })}
      </div>
    );
};

Breadcrumbs.propTypes = {
    location: PropTypes.shape(),
    loginName: PropTypes.string,
    match: PropTypes.shape(),
    panel: PropTypes.bool,
    paramsMapping: PropTypes.shape(),
};

function mapStateToProps (state) {
    let entryMap = state.entryState.get('byId').map(entry => entry.getIn(['content', 'title']));
    const fullEntry = selectFullEntry(state);
    if (fullEntry && !entryMap.get(fullEntry.get('entryId'))) {
        entryMap = entryMap.set(fullEntry.get('entryId'), fullEntry.getIn(['content', 'title']));
    }
    const highlightsMap = state.highlightState.get('byId').map((highlight) => {
        const content = highlight.get('content');
        const result = content.length > 20 ? `"${content.slice(0, 20)}...` : `"${content}"`;
        return result;
    });
    return {
        loginName: selectLoggedAkashaId(state) || selectLoggedEthAddress(state),
        paramsMapping: {
            entryId: entryMap.toJS(),
            highlightId: highlightsMap.toJS()
        }
    };
}

export default connect(mapStateToProps)(withRouter(Breadcrumbs));
