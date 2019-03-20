// @flow strict

import * as React from 'react';
/*::
    type Props = {
        children: React.Node
    };
*/

function MyProfileLayout (props /* : Props */) {
    return (
        <>
            <div>{props.children}</div>
        </>
    );
}

export default MyProfileLayout;
