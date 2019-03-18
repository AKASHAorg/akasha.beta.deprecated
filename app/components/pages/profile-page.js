// @flow strict

import * as React from "react";
import Route from "react-router-dom/Route";
import { Fill } from "react-slot-fill";

/*:: type Props = {||}; */

function ProfilePage (props /* : Props */) {
    return (
        <>
            <Route exact path="/@:akashaId" component={ProfilePage} />
            <Route exact path="/0x:ethAddress" component={ProfilePage} />
        </>
    );
}

export default ProfilePage;
