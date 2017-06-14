import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LogoButton, ServiceStatusBar } from '../../components';
import { generalMessages } from '../../locale-data/messages';

class PanelHeader extends Component {
  render() {
    const { disableStopService, intl, noStatusBar, noLogoButton, title, showBorder } = this.props;
    return (
      <div className="col-xs-12" style={{ padding: '0 24px', borderBottom: showBorder ? '1px solid #DDD' : 'none' }}>
        <div className="row middle-xs" style={{ display: 'flex' }} >
          {!noLogoButton &&
            <div style={{ flex: '0 0 auto' }}>
              <LogoButton />
            </div>
          }
          <div style={{ fontWeight: '300', flex: '1 1 auto', marginLeft: '10px' }} >
            {title || intl.formatMessage(generalMessages.akasha)}
          </div>
          {!noStatusBar &&
            <div style={{ flex: '0 0 auto' }} >
              <ServiceStatusBar disableStopService={disableStopService} />
            </div>
          }
        </div>
      </div>
    );
  }
}

PanelHeader.propTypes = {
    disableStopService: PropTypes.bool,
    intl: PropTypes.shape(),
    noStatusBar: PropTypes.bool,
    noLogoButton: PropTypes.bool,
    title: PropTypes.node.isRequired,
};

export default PanelHeader;
