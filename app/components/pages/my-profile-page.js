// @flow strict

import * as React from "react";
import Route from "react-router-dom/Route";
import { Fill } from "react-slot-fill";

/*:: type Props = {||}; */

function MyProfilePage (props /* : Props */) {
    return (
        <>
            <Route path="/profileoverview/overview" render={() => <>Profile Overview</>} />
            <Route path="/profileoverview/myentries" render={() => <>My Entries</>} />
            <Route path="/profileoverview/highlights" render={() => <>Highlights</>} />
            <Route exact path="/profileoverview/lists" render={() => <>Lists</>} />
            <Route path="/profileoverview/lists/:listId" render={() => <>A list item</>} />
            <Route path="/profileoverview/settings" render={() => <>Settings</>} />
            <Route path="/profileoverview/preferences" render={() => <>App Prefferences</>} />
        </>
    );
}

export default MyProfilePage;
