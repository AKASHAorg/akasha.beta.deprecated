import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { EntryVersionTimeline, NewEntryTopBar } from '../';

const { confirm } = Modal;

const EditorFooter = (props) => { // eslint-disable-line complexity
    const {
        disabled, draftObj, draftRevertToVersion, intl, latestVersion, onPublish,
        onPublishOptions, showSecondarySidebar
    } = props;
    const { localChanges, onChain } = draftObj;
    const showRevertConfirm = (ev, version) => {
        const handleVersionRevert = () => {
            draftRevertToVersion({
                version,
                id: draftObj.id
            });
        };
        if (localChanges) {
            confirm({
                content: intl.formatMessage(entryMessages.revertConfirmTitle),
                okText: intl.formatMessage(generalMessages.yes),
                okType: 'danger',
                cancelText: intl.formatMessage(generalMessages.no),
                onOk: handleVersionRevert,
                onCancel () {
                }
            });
        } else {
            handleVersionRevert();
        }
        ev.preventDefault();
    }

    return (
        <div
            className={
                `edit-entry-page__footer-wrapper
            edit-entry-page__footer-wrapper${ showSecondarySidebar ? '' : '_full' }`
            }
        >
            <div className="edit-entry-page__footer">
                <NewEntryTopBar/>
                <div className="edit-entry-page__footer-timeline-wrapper">
                    { onChain && (localChanges || latestVersion > 0) &&
                    <div
                        className={
                            `edit-entry-page__footer-timeline
                  edit-entry-page__footer-timeline${ latestVersion ? '' : '_empty' }`
                        }
                    >
                        <EntryVersionTimeline
                            draftObj={ draftObj }
                            onRevertConfirm={ showRevertConfirm }
                            intl={ intl }
                        />
                    </div>
                    }
                </div>
                <div className="edit-entry-page__footer-actions">
                    <Button
                        size="large"
                        onClick={ onPublishOptions }
                        className={ 'edit-entry-page__options-button' }
                    >
                        { intl.formatMessage(entryMessages.publishOptions) }
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        className={
                            `edit-entry-page__publish-button
                  edit-entry-page__publish-button${ draftObj.get('publishing') ? '_pending' : '' }`
                        }
                        onClick={ onPublish }
                        loading={ draftObj.get('publishing') }
                        disabled={ disabled }
                    >
                        { !draftObj.get('publishing') && onChain && intl.formatMessage(generalMessages.update) }
                        { !draftObj.get('publishing') && !onChain && intl.formatMessage(generalMessages.publish) }
                        { draftObj.get('publishing') && onChain && intl.formatMessage(generalMessages.updating) }
                        { draftObj.get('publishing') && !onChain &&
                        intl.formatMessage(generalMessages.publishing)
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
};

EditorFooter.propTypes = {
    disabled: PropTypes.bool,
    draftObj: PropTypes.shape(),
    draftRevertToVersion: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    latestVersion: PropTypes.number,
    onPublish: PropTypes.func.isRequired,
    onPublishOptions: PropTypes.func.isRequired,
    showSecondarySidebar: PropTypes.bool,
};

export default injectIntl(EditorFooter);
