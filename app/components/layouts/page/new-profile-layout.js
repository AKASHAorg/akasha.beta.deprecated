// @flow strict

import * as React from 'react';

/*::
    type Props = {
        children: React.Node
    };
*/

function NewProfileLayout (props /* : Props */) {
    return (
        <>
            <div>{ props.children }</div>
        </>
    );
}

export default NewProfileLayout;
