import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Card, Input } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { HighlightHeader, Icon } from '../';

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
        const { highlight, editNotes, toggleEditing, toggleNoteEditable } = this.props;
        editNotes(highlight.get('id'), this.state.notes);
        toggleNoteEditable(highlight.get('id'));
        toggleEditing(highlight.get('id'));
    };

    handleCancel = () => {
        const { highlight, toggleEditing, toggleNoteEditable } = this.props;
        toggleNoteEditable(highlight.get('id'));
        toggleEditing(highlight.get('id'));
    }

    render () {
        const { containerRef, deleteHighlight, editing, highlight, intl, publisher,
            toggleEditing, toggleNoteEditable } = this.props;
        const notes = highlight.get('notes');
        const editNotes = highlight.get('editNotes');
        const cardClassName = `highlight-card ${editNotes && 'highlight-card_editing'}
            ${!!editing && 'highlight-card_opaque'}`;

        return (
          <Card
            className={cardClassName}
            title={
              <HighlightHeader
                containerRef={containerRef}
                deleteHighlight={deleteHighlight}
                highlight={highlight}
                publisher={publisher}
                toggleNoteEditable={toggleNoteEditable}
                toggleEditing={toggleEditing}
              />
            }
          >
            <div className="highlight-card__quote">
              <div className="highlight-card__quote-icon-wrapper">
                <Icon className="highlight-card__quote-icon" type="quote" />
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
                      className="highlight-card__notes-input"
                      rows={3}
                      value={this.state.notes}
                      onChange={this.onNotesChange}
                    />
                    <div className="highlight-card__notes-input-buttons">
                      <div className="highlight-card__notes-input-cancel">
                        <Button
                          size="small"
                          onClick={this.handleCancel}
                        >
                          {intl.formatMessage(generalMessages.cancel)}
                        </Button>
                      </div>
                      <Button
                        size="small"
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
    editing: PropTypes.string,
    editNotes: PropTypes.func,
    toggleEditing: PropTypes.func,
    toggleNoteEditable: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    publisher: PropTypes.shape().isRequired
};

export default injectIntl(HighlightCard);
