import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Popover } from 'antd';
import classNames from 'classnames';
import { AddToBoard, NewDashboardForm } from '../';
import * as columnTypes from '../../constants/columns';
import { dashboardMessages, entryMessages, generalMessages } from '../../locale-data/messages';

const DASHBOARDS = 'DASHBOARDS';
const NEW_DASHBOARD = 'NEW_DASHBOARD';

class TagListItem extends Component {
    state = {
        content: null,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout);
        }
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }
    }

    closePopover = () => this.onVisibleChange(false);

    onAddToDashboard = () => {
        this.setInputFocusAsync();
        this.setState({
            content: DASHBOARDS
        });
    };

    onNewDashboard = () => {
        this.setState({
            content: NEW_DASHBOARD
        });
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({
            content: popoverVisible ? DASHBOARDS : this.state.content,
            popoverVisible
        });
        // Delay state reset until popover animation is finished
        if (!popoverVisible) {
            this.resetTimeout = setTimeout(() => {
                this.resetTimeout = null;
                this.props.dashboardSearch('');
                this.setState({
                    content: null
                });
            }, 100);
        } else {
            this.setInputFocusAsync();
        }
    };

    setInputFocusAsync = () => {
        this.focusTimeout = setTimeout(() => {
            this.focusTimeout = null;
            const input = document.getElementById('add-to-board-search');
            if (input) {
                input.focus();
            }
        }, 100);
    };

    showPreview = () => {
        const { showPreview, tag } = this.props;
        showPreview({ columnType: columnTypes.tag, value: tag });
    }

    renderContent = () => {
        const { tag } = this.props;
        const { content } = this.state;

        switch (content) {
            case DASHBOARDS:
                return (
                  <AddToBoard
                    closePopover={this.closePopover}
                    onNewDashboard={this.onNewDashboard}
                    tag={tag}
                  />
                );
            case NEW_DASHBOARD:
                return (
                  <NewDashboardForm
                    onCancel={this.onAddToDashboard}
                    tag={tag}
                  />
                );
            default:
                return null;
        }
    }

    render () {
        const { entriesCount, intl, isLast, tag } = this.props;
        const { popoverVisible } = this.state;
        const itemClass = classNames('tag-list-item', {
            'tag-list-item_last': isLast
        });
        return (
          <div className={itemClass}>
            <div className="tag-list-item__text-wrapper">
              <span className="tag-list-item__tag">#{tag}</span>
              <span className="tag-list-item__entry-count">
                {intl.formatMessage(entryMessages.entriesCount, { count: entriesCount.get(tag) })}
              </span>
            </div>
            <div className="tag-list-item__buttons">
              <Popover
                content={this.wasVisible ? this.renderContent() : null}
                onVisibleChange={this.onVisibleChange}
                overlayClassName="popover-menu"
                placement="bottom"
                trigger="click"
                visible={popoverVisible}
              >
                <Button className="tag-list-item__button" size="small">
                  {intl.formatMessage(dashboardMessages.addToBoard)}
                </Button>
              </Popover>
              <Button
                className="tag-list-item__button tag-list-item__preview-button"
                onClick={this.showPreview}
                size="small"
              >
                {intl.formatMessage(generalMessages.preview)}
              </Button>
            </div>
          </div>
        );
    }
}

TagListItem.propTypes = {
    dashboardSearch: PropTypes.func.isRequired,
    entriesCount: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    isLast: PropTypes.bool,
    showPreview: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
};

export default injectIntl(TagListItem);
