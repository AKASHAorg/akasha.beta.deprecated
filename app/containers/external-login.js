// @flow strict

import * as React from "react";
/*::
    type Props = {
        active: boolean
    };
*/

function ExternalLogin (props /* : Props */) {
    if (!props.active) {
        return null;
    }
    return <div>External Login Page!</div>;
}

export default ExternalLogin;
