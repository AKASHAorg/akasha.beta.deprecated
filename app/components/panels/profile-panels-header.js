import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

const beautifyName = (name) => {
    switch (name) {
        case 'editProfile':
            return 'Edit Profile';
        case 'lists':
            return 'Lists';
        case 'settings':
            return 'Settings';
        default:
            return name;
    }
};

const createLink = (href, text) => {
    return <Link to={href}>{text}</Link>;
};

const crumbifyPath = (match, location) => {
    const { params } = match;
    console.log(match, location, 'the match');
    if (params.others.includes('/')) {
        return params.others
            .split('/')
            .map((part, index, arr) => {
                if (index < arr.length - 1) {
                    return (
                        <span key={part}>
                            <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} />
                            {createLink('default', beautifyName(part))}
                        </span>
                    );
                }
                return (
                    <span>
                        <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} />
                        {beautifyName(part)}
                    </span>
                );
            });
    }
    return (
        <span>
            <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} />
            {createLink(params.others, params.others)}
        </span>
    );
};
const createBreadCrumbs = ({ rootCrumb, match, location }) => {
    const { params } = match;
    let breadCrumb = <span>{createLink('uprofile', rootCrumb)}</span>;
    if (params.panelName === 'uprofile') {
        breadCrumb = <span>{rootCrumb}</span>;
    }
    if (params.panelName !== 'uprofile') {
        breadCrumb = (
            <span>
                {
                    createLink('uprofile', rootCrumb)
                } <ArrowRight style={{ height: 18, verticalAlign: 'middle' }} /> {
                    params.others ?
                    createLink(`${params.panelName}`, beautifyName(params.panelName)) :
                    beautifyName(params.panelName)
                } {params.others && crumbifyPath(match, location)}
            </span>
        );
    }
    return breadCrumb;
};

const ProfilePanelsHeader = (props) => {
    const { firstName, lastName, onPanelNavigate, onLogout } = props;
    return (
      <div className="col-xs-12" style={{ height: 48, background: '#FAFAFA', padding: '0 24px' }}>
        <div className="row middle-xs">
            <div className="col-xs-8">
                <div className="row">
                    <div className="col-xs-12" style={{ lineHeight: '48px' }}>
                        <Route
                            path="/:rootPath+/panel/:panelName/:others*"
                            render={({ match, location }) => createBreadCrumbs({ match, location, rootCrumb: `${firstName} ${lastName}` })}
                        />
                    </div>
                </div>
            </div>
            <div className="col-xs-4">
                <div className="row">
                    <div
                        className="col-xs-4 link-button"
                        onClick={onPanelNavigate('settings')}
                    >
                        Settings
                    </div>
                    <div
                        className="col-xs-4 link-button"
                        onClick={onPanelNavigate('editProfile')}
                    >
                        Edit profile
                    </div>
                    <div
                        className="col-xs-4 link-button"
                        onClick={onLogout}
                    >
                        Logout
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};

ProfilePanelsHeader.propTypes = {
    firstName: PropTypes.string,
    history: PropTypes.shape(),
    lastName: PropTypes.string,
    location: PropTypes.shape(),
    onLogout: PropTypes.func,
    onPanelNavigate: PropTypes.func,
};

export default ProfilePanelsHeader;
