import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui';
import { TagChip } from 'shared-components';
import styles from './draft-card.scss';

class DraftCard extends Component {
    render () {
        const {
            title, headerTitle, lastUpdated, excerpt, wordCount, tags,
            onTitleClick
        } = this.props;
        return (
          <Card className="start-xs" style={{ margin: '5px 5px 16px 5px' }}>
            <CardHeader
              title={headerTitle}
              subtitle={`${lastUpdated} - ${wordCount} words`}
              titleStyle={{ fontSize: '16px', fontWeight: '600' }}
              subtitleStyle={{ fontSize: '12px' }}
              style={{ paddingBottom: '4px' }}
            />
            <CardTitle
              onClick={onTitleClick}
              title={title}
              style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontWeight: '600',
                  wordWrap: 'break-word',
                  maxHeight: '80px',
                  overflow: 'hidden'
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
            <CardText style={{ paddingTop: '4px', paddingBottom: '4px', wordWrap: 'break-word' }}>
              {excerpt}
            </CardText>
          </Card>
        );
    }
}

DraftCard.propTypes = {
    headerTitle: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    headerActions: PropTypes.element,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    wordCount: PropTypes.number.isRequired,
    onTitleClick: PropTypes.func.isRequired,
    tags: PropTypes.shape()
};

export default DraftCard;