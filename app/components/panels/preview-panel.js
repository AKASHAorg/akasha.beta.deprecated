import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { AddToBoardPopover, EntryList } from '../';
import { hidePreview } from '../../local-flux/actions/app-actions';
import { entryTagIterator } from '../../local-flux/actions/entry-actions';
import { appSelectors, dashboardSelectors, entrySelectors } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';
import withRequest from '../high-order-components/with-request';

class PreviewPanel extends Component {
    componentDidMount () {
        const { preview, column } = this.props;
        this.props.dispatchAction(entryTagIterator({
            id: 'previewColumn',
            value: preview.get('value'), ...column
        }));
    }

    componentClickAway = () => {
        this.props.hidePreview();
    };

    loadMoreEntries = () => {
        const { column, preview } = this.props;
        this.props.dispatchAction(entryTagIterator({
            id: 'previewColumn',
            value: preview.get('value'), ...column
        }));
    };

    render () {
        const { column, intl, preview, previewEntries, entries } = this.props;
        return (
            <div className="preview-panel">
                <div className="preview-panel__header">
                    <div className="overflow-ellipsis preview-panel__title">
                        { intl.formatMessage(dashboardMessages.previewTag, { tagName: preview.get('value') }) }
                    </div>
                    <AddToBoardPopover tag={ preview.get('value') }>
                        <Button className="preview-panel__add-to-board" size="small">
                            { intl.formatMessage(generalMessages.addTo) }
                        </Button>
                    </AddToBoardPopover>
                </div>
                <div className="preview-panel__list-wrapper">
                    <EntryList
                        contextId="previewColumn"
                        entries={ previewEntries }
                        fetchingEntries={ column.getIn(['flags', 'fetchingEntries']) }
                        fetchingMoreEntries={ column.getIn(['flags', 'fetchingMoreEntries']) }
                        fetchMoreEntries={ this.loadMoreEntries }
                        moreEntries={ column.getIn(['flags', 'moreEntries']) }
                    />
                </div>
            </div>
        );
    }
}

PreviewPanel.propTypes = {
    column: PropTypes.shape().isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    hidePreview: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    preview: PropTypes.shape().isRequired,
    previewEntries: PropTypes.shape().isRequired,
    entries: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        column: dashboardSelectors.selectColumnById(state, 'previewColumn'),
        preview: appSelectors.selectShowPreview(state),
        previewEntries: dashboardSelectors.getColumnEntries(state, 'previewColumn'),
        entries: entrySelectors.selectEntriesById(state),
    };
}

export default connect(
    mapStateToProps,
    {
        entryTagIterator,
        hidePreview
    }
)(injectIntl(clickAway(withRequest(PreviewPanel))));
