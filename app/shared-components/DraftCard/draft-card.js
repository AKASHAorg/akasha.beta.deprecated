import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardText, IconButton, CircularProgress } from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { TagChip } from '../';
import styles from './draft-card.scss';

class DraftCard extends Component {
    render () {
        const {
            title, headerTitle, lastUpdated, excerpt, wordCount, tags,
            onDelete, onTitleClick, isPublishing
        } = this.props;
        const noop = () => {};
        return (
          <Card className="start-xs has-hidden-action" style={{ margin: '5px 5px 16px 5px' }}>
            <CardHeader
              avatar={isPublishing ? <CircularProgress /> : null}
              title={isPublishing ? 'Publishing Entry' : headerTitle}
              subtitle={`${lastUpdated} - ${wordCount || 0} words`}
              titleStyle={{ fontSize: '16px', fontWeight: '600' }}
              subtitleStyle={{ fontSize: '12px' }}
              style={{ paddingBottom: '4px', cursor: 'default', userSelect: 'none' }}
            >
              <IconButton
                className="hidden_action"
                onClick={isPublishing ? noop : onDelete}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <DeleteIcon />
              </IconButton>
            </CardHeader>
            <CardTitle
              onClick={isPublishing ? noop : onTitleClick}
              title={title || 'No Title'}
              style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  maxHeight: '80px',
                  overflow: 'hidden',
                  cursor: isPublishing ? 'default' : 'pointer'
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
                  cursor: isPublishing ? 'default' : 'pointer'
              }}
              onClick={isPublishing ? noop : onTitleClick}
            >
              {(wordCount > 0) ? excerpt : 'No content yet..'}
            </CardText>
          </Card>
        );
    }
}

DraftCard.propTypes = {
    headerTitle: PropTypes.string,
    lastUpdated: PropTypes.string.isRequired,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    wordCount: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onTitleClick: PropTypes.func.isRequired,
    tags: PropTypes.shape(),
    isPublishing: PropTypes.bool
};

export default DraftCard;
