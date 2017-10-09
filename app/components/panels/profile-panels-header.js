import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'antd';
import { profileLogout } from '../../local-flux/actions/profile-actions';
import { selectLoggedProfile } from '../../local-flux/selectors';
import { generalMessages } from '../../locale-data/messages';
import { Breadcrumbs, PanelLink } from '../';

const ProfilePanelsHeader = (props) => {
    const { location, loggedProfile, match, intl } = props;
    const loggedAkashaId = loggedProfile.get('akashaId');
    const loggedEthAddress = loggedProfile.get('ethAddress');

    if (!location.pathname.includes('/panel')) {
        return null;
    }

    return (
      <div style={{ height: 48, background: '#FAFAFA', padding: '0 24px' }}>
        <Row type="flex" align="middle" justify="center">
          <Col span={16}>
            <div style={{ lineHeight: '48px' }}>
              {!loggedAkashaId && match.params.panelName === 'editprofile' ?
                <span>
                  {loggedAkashaId || loggedEthAddress} &gt;
                    <b>{intl.formatMessage(generalMessages.completeProfileCrumb)}</b>
                </span> :
                <Breadcrumbs panel />
              }
            </div>
          </Col>
          <Col span={8}>
            <Row type="flex" justify="end">
              <Col
                span={8}
                className="link-button"
                style={{ textAlign: 'center' }}
              >
                <PanelLink to="settings">
                  {intl.formatMessage(generalMessages.settings)}
                </PanelLink>
              </Col>
              {!!loggedAkashaId &&
                <Col
                  span={8}
                  className="link-button"
                  style={{ textAlign: 'center' }}
                >
                  <PanelLink to="editProfile">
                    {intl.formatMessage(generalMessages.editProfile)}
                  </PanelLink>
                </Col>
              }
              <Col
                span={8}
                className="link-button"
                style={{ textAlign: 'center' }}
                onClick={props.profileLogout}
              >
                {intl.formatMessage(generalMessages.logout)}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
};

ProfilePanelsHeader.propTypes = {
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    match: PropTypes.shape(),
    profileLogout: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        loggedProfile: selectLoggedProfile(state),
    };
}

export default connect(
    mapStateToProps,
    {
        profileLogout
    },
    null,
    { pure: false }
)(withRouter(injectIntl(ProfilePanelsHeader)));
