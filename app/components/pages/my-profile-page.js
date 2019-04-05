// @flow strict

import * as React from 'react';
import Route from 'react-router-dom/Route';
import { Fill } from 'react-slot-fill';
import { MY_PROFILE_SLOTS } from '../layouts/slot-names';

/*:: type Props = {||}; */

function MyProfilePage (props /* : Props */) {
    return (
        <>
            <Route
                path="/profileoverview/myentries"
                render={() => (
                    <>
                        <Fill name={MY_PROFILE_SLOTS.PAGE_SIDEBAR}>
                            <>Page secondary sidebar</>
                        </Fill>
                        <Fill name={MY_PROFILE_SLOTS.MY_ENTRIES_PAGE}>
                            <>My entries page content</>
                        </Fill>
                    </>
                )}
            />
            <Route path="/profileoverview/highlights" render={() => <>Highlights</>} />
            <Route exact path="/profileoverview/lists" render={() => <>Lists</>} />
            <Route path="/profileoverview/lists/:listId" render={() => <>A list item</>} />
            <Route path="/profileoverview/settings" render={() => <>Settings</>} />
            <Route path="/profileoverview/preferences" render={() => <>App Prefferences</>} />
        </>
    );
}

export default MyProfilePage;
