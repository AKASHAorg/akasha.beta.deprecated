import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Card, Icon, Input } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { HighlightHeader } from '../';

class HighlightCard extends Component {
    state = {
        notes: this.props.highlight ? this.props.highlight.get('notes') : ''
    };

    onNotesChange = (ev) => {
        this.setState({
            notes: ev.target.value
        });
    };

    handleSave = () => {
        const { highlight, editNotes, toggleNoteEditable } = this.props;
        editNotes(highlight.get('id'), this.state.notes);
        toggleNoteEditable(highlight.get('id'));
    };

    render () {
        const { containerRef, deleteHighlight, highlight, intl, publisher, toggleNoteEditable } = this.props;
        const notes = highlight.get('notes');
        const editNotes = highlight.get('editNotes');

        return (
          <Card
            className="highlight-card"
            title={
              <HighlightHeader
                containerRef={containerRef}
                deleteHighlight={deleteHighlight}
                highlight={highlight}
                publisher={publisher}
                toggleNoteEditable={toggleNoteEditable}
              />
            }
          >
            <div>
              <div className="highlight-card__quote">
                <Icon type="double-left" style={{ fontSize: '20px' }} />
              </div>
              <div className="highlight-card__content">
                {highlight.get('content')}
              </div>
            </div>
            {(notes || editNotes) &&
              <div className="highlight-card__notes">
                <div className="highlight-card__notes-title">
                  {intl.formatMessage(generalMessages.notes)}
                </div>
                {editNotes ?
                  <div className="highlight-card__notes-editor">
                    <Input.TextArea
                      autoFocus
                      autosize
                      className="highlight-card__notes-input"
                      rows={3}
                      value={this.state.notes}
                      onChange={this.onNotesChange}
                    />
                    <div className="highlight-card__notes-input-buttons">
                      <div className="highlight-card__notes-input-cancel">
                        <Button
                          onClick={() => toggleNoteEditable(highlight.get('id'))}
                        >
                          {intl.formatMessage(generalMessages.cancel)}
                        </Button>
                      </div>
                      <Button
                        type="primary"
                        onClick={this.handleSave}
                      >
                        {intl.formatMessage(generalMessages.save)}
                      </Button>
                    </div>
                  </div> :
                  <div className="highlight-card__notes-content">
                    {highlight.get('notes')}
                  </div>
                }
              </div>
            }
          </Card>
        );
    }
}

HighlightCard.propTypes = {
    containerRef: PropTypes.shape(),
    deleteHighlight: PropTypes.func,
    highlight: PropTypes.shape().isRequired,
    editNotes: PropTypes.func,
    toggleNoteEditable: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    publisher: PropTypes.shape().isRequired
};

export default injectIntl(HighlightCard);
