import React from 'react';
import { entryMessages, profileMessages } from '../../locale-data/messages';

const ColumnEmptyPlaceholder = ({ placeholderMessage, type, intl }) => {
    if (type === 'profileFollowers' || type === 'profileFollowings') {
        return (
            <div className="flex-center profile-column-placeholder">
                <div className="profile-column-placeholder-inner">
                    <div className="profile-column-placeholder-image"/>
                    <div className="profile-column-placeholder-text">
                        { placeholderMessage || intl.formatMessage(profileMessages.noProfiles) }
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex-center entry-column-placeholder">
            <div className="entry-column-placeholder-inner">
                <div className="entry-column-placeholder-image"/>
                <div className="entry-column-placeholder-text">
                    { placeholderMessage || intl.formatMessage(entryMessages.noEntries) }
                </div>
            </div>
        </div>
    );
};

export default ColumnEmptyPlaceholder;
