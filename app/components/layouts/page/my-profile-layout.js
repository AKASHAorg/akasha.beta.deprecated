// @flow strict

import * as React from 'react';
import { Route } from 'react-router';
import { Slot } from 'react-slot-fill';
import { MY_PROFILE_SLOTS } from '../slot-names';

/*::
    type Props = {
        children: React.Node
    };
*/

function MyEntriesPageLayout () {
    return <Slot name={ MY_PROFILE_SLOTS.MY_ENTRIES_PAGE }/>;
}

function HighlightsPageLayout () {
    return <Slot name={ MY_PROFILE_SLOTS.HIGHLIGHTS_PAGE }/>;
}

function MyProfileLayout (props /* : Props */) {
    return (
        <>
            <Route
                path="/profileoverview"
                render={ () => (
                    <div className="my-profile-layout">
                        <div className="my-profile-layout_sidebar-container">
                            <Slot name={ MY_PROFILE_SLOTS.PAGE_SIDEBAR }/>
                        </div>
                        <div className="my-profile-layout_page-container">
                            <Route path="/profileoverview/myentries"
                                   render={ MyEntriesPageLayout }/>
                            <Route path="/profileoverview/highlights"
                                   render={ HighlightsPageLayout }/>
                        </div>
                    </div>
                ) }
            />
        </>
    );
}

export default MyProfileLayout;
