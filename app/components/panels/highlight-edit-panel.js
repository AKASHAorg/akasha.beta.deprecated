import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Button, Input } from 'antd';
import { highlightDelete, highlightEditNotes } from '../../local-flux/actions/highlight-actions';
import { selectHighlight, selectProfile } from '../../local-flux/selectors';
import { generalMessages, highlightMessages } from '../../locale-data/messages';
import { HighlightHeader, ProfilePanelsHeader } from '../';

const { TextArea } = Input;

class HighlightEditPanel extends Component {
    state = {
        notes: this.props.highlight ? this.props.highlight.get('notes') : ''
    };

    componentWillReceiveProps (nextProps) {
        const { highlight } = nextProps;
        if (!highlight || highlight.get('notes') !== this.props.highlight.get('notes')) {
            this.navigateToHighlights();
        }
    }

    navigateToHighlights = () => {
        const { history, location } = this.props;
        const { pathname, search } = location;
        const root = pathname.split('/panel/')[0];
        const url = `${root}/panel/highlights${search}`;
        history.push(url);
    };

    onNotesChange = (ev) => {
        this.setState({
            notes: ev.target.value
        });
    };

    handleSave = () => {
        const { highlight } = this.props;
        this.props.highlightEditNotes(highlight.get('id'), this.state.notes);
    };

    render () {
        const { highlight, intl, publisher } = this.props;
        if (!highlight) {
            return null;
        }
        return (
          <div className="panel">
            <ProfilePanelsHeader />
            <div className="panel__content highlight-edit-panel">
              <div className="highlight-edit-panel__header">
                <HighlightHeader
                  deleteHighlight={this.props.highlightDelete}
                  highlight={highlight}
                  publisher={publisher}
                />
              </div>
              <div className="highlight-edit-panel__content">
                {highlight.get('content')}
              </div>
              <div className="highlight-edit-panel__notes">
                <TextArea
                  autoFocus
                  className="highlight-edit-panel__textarea"
                  onChange={this.onNotesChange}
                  placeholder={intl.formatMessage(highlightMessages.addYourNotes)}
                  rows={6}
                  value={this.state.notes}
                />
              </div>
              <div className="highlight-edit-panel__actions">
                <Button
                  className="highlight-edit-panel__button"
                  onClick={this.navigateToHighlights}
                  size="large"
                >
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>
                <Button
                  className="highlight-edit-panel__button"
                  onClick={this.handleSave}
                  size="large"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.save)}
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

HighlightEditPanel.propTypes = {
    highlight: PropTypes.shape(),
    highlightDelete: PropTypes.func.isRequired,
    highlightEditNotes: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    location: PropTypes.shape().isRequired,
    publisher: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const id = ownProps.match.params.highlightId;
    const highlight = selectHighlight(state, id);
    return {
        highlight,
        publisher: highlight && selectProfile(state, highlight.get('publisher'))
    };
}

export default connect(
    mapStateToProps,
    {
        highlightDelete,
        highlightEditNotes,
    }
)(withRouter(injectIntl(HighlightEditPanel)));
