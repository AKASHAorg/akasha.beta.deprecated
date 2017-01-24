import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { injectIntl } from 'react-intl';
import { Dialog, RaisedButton, SvgIcon } from 'material-ui';
import { ToolbarVotes } from 'shared-components/svg';
import { entryMessages } from 'locale-data/messages';

class EntryVersionsPanel extends Component {

    componentDidMount () {
        ReactTooltip.rebuild();
    }

    getVersionIndexStyle = (index) => {
        const { currentVersion } = this.props;
        const { palette } = this.context.muiTheme;
        return {
            display: 'inline-flex',
            flex: '0 0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: `1px solid ${palette.textColor}`,
            color: currentVersion === index ? palette.alternateTextColor : palette.textColor,
            backgroundColor: currentVersion === index ? palette.primary1Color : palette.canvasColor
        };
    };

    selectVersion = (version) => {
        const { closeVersionsPanel, getVersion } = this.props;
        closeVersionsPanel();
        getVersion(version);
    };

    renderDelimiter = (index) => {
        const { palette } = this.context.muiTheme;
        return (
          <div
            key={`${index}delimiter`}
            style={{
                height: '25px',
                marginLeft: '15px',
                borderLeft: `1px solid ${palette.borderColor}`
            }}
          />
        );
    };

    renderVersions = () => {
        const { currentVersion, existingDraft, handleEdit, intl, isOwnEntry,
            latestVersion } = this.props;
        const { palette } = this.context.muiTheme;
        const versions = [];

        for (let i = 0; i <= latestVersion; i += 1) {
            versions.unshift(
              <div
                key={i}
                className="contentLink"
                style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}
                onClick={() => this.selectVersion(i)}
              >
                <div style={this.getVersionIndexStyle(i)}>
                  <span>{i}</span>
                </div>
                <div
                  style={{
                      paddingLeft: '20px',
                      color: palette.textColor,
                      fontWeight: currentVersion === i ? 600 : 'auto'
                  }}
                >
                  {i > 0 ?
                    intl.formatMessage(entryMessages.versionNumber, { index: i }) :
                    intl.formatMessage(entryMessages.originalVersion)
                  }
                </div>
              </div>
            );
            if (i !== latestVersion) {
                versions.unshift(this.renderDelimiter(i));
            }
        }
        if (isOwnEntry && existingDraft) {
            versions.unshift(this.renderDelimiter('local'));
            versions.unshift(
              <div
                key="local"
                style={{ display: 'flex', alignItems: 'center', margin: '10px 0', height: '30px' }}
              >
                <div style={this.getVersionIndexStyle()}>
                  <span>&#x2217;</span>
                </div>
                <div
                  style={{
                      paddingLeft: '20px',
                      color: palette.textColor,
                      fontWeight: 'auto',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flex: '1 1 auto'
                  }}
                >
                  {intl.formatMessage(entryMessages.localVersion)}
                  <RaisedButton
                    label={intl.formatMessage(entryMessages.continueEditing)}
                    onClick={handleEdit}
                    primary
                  />
                </div>
              </div>
            );
        }
        return (
          <div style={{ padding: '10px' }}>
            {versions}
          </div>
        );
    };

    render () {
        const { closeVersionsPanel, intl } = this.props;
        return (
          <Dialog
            contentStyle={{ maxWidth: 400 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                <SvgIcon viewBox="0 0 16 16" style={{ marginRight: '14px', flex: '0 0 auto' }}>
                  <ToolbarVotes />
                </SvgIcon>
                <span
                  style={{ display: 'inline-block', textOverflow: 'ellipsis', overflowX: 'hidden' }}
                >
                  {intl.formatMessage(entryMessages.versionHistory)}
                </span>
              </div>
            }
            titleStyle={{ overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            open
            onRequestClose={closeVersionsPanel}
            autoScrollBodyContent
          >
            {this.renderVersions()}
          </Dialog>
        );
    }

}

EntryVersionsPanel.contextTypes = {
    muiTheme: PropTypes.shape()
};

EntryVersionsPanel.propTypes = {
    closeVersionsPanel: PropTypes.func.isRequired,
    currentVersion: PropTypes.number,
    existingDraft: PropTypes.shape(),
    getVersion: PropTypes.func.isRequired,
    handleEdit: PropTypes.func,
    intl: PropTypes.shape(),
    isOwnEntry: PropTypes.bool,
    latestVersion: PropTypes.number,
};

export default injectIntl(EntryVersionsPanel);
