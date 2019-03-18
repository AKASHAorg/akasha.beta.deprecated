// @flow strict

import * as React from "react";
/*::
    type Props = {
        active: boolean
    };
*/

function ExternalLogin (props /* : Props */) {
    console.log("external login is active:", props.active);
    if (!props.active) {
        return null;
    }
    return <div>External Login Page!</div>;
}

export default ExternalLogin;
