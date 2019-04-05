// @flow strict

import * as React from 'react';
import Route from 'react-router-dom/Route';
import { Fill } from 'react-slot-fill';

/*:: type Props = {||}; */

function ProfilePage (props /* : Props */) {
    return (
        <>
            <Route exact path="/@:akashaId" component={() => <div>Profile Page</div>} />
            <Route exact path="/0x:ethAddress" component={() => <div>Profile Page</div>} />
        </>
    );
}

export default ProfilePage;
