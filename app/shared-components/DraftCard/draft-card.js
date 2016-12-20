import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardTitle, CardText, IconButton } from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { TagChip } from 'shared-components';
import styles from './draft-card.scss';

class DraftCard extends Component {
    render () {
        const {
            title, headerTitle, lastUpdated, excerpt, wordCount, tags,
            onDelete, onTitleClick
        } = this.props;
        return (
          <Card className="start-xs has_hidden_action" style={{ margin: '5px 5px 16px 5px' }}>
            <CardHeader
              title={headerTitle}
              subtitle={`${lastUpdated} - ${wordCount} words`}
              titleStyle={{ fontSize: '16px', fontWeight: '600' }}
              subtitleStyle={{ fontSize: '12px' }}
              style={{ paddingBottom: '4px', cursor: 'default', userSelect: 'none' }}
            >
              <IconButton
                className="hidden_action"
                onClick={onDelete}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <DeleteIcon />
              </IconButton>
            </CardHeader>
            <CardTitle
              onClick={onTitleClick}
              title={title || 'No Title'}
              style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  maxHeight: '80px',
                  overflow: 'hidden',
                  cursor: 'pointer'
              }}
            />
            {tags &&
              <CardText style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <div style={{ display: 'flex' }}>
                  {tags.map((tag, key) =>
                    <TagChip
                      key={key}
                      tag={tag}
                      style={{ height: '24px' }}
                    />
                  )}
                </div>
              </CardText>
            }
            <CardText
              style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  wordWrap: 'break-word',
                  cursor: 'pointer'
              }}
              onClick={onTitleClick}
            >
              {(wordCount > 0) ? excerpt : 'No content yet..'}
            </CardText>
          </Card>
        );
    }
}

DraftCard.propTypes = {
    headerTitle: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    wordCount: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    onTitleClick: PropTypes.func.isRequired,
    tags: PropTypes.shape()
};

export default DraftCard;
