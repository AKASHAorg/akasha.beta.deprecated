// @flow strict

import * as React from 'react';
/*::
    type Props = {
        children: React.Node
    };
*/

function EditorPageLayout (props /* : Props */) {
    return (
        <>
            <div className="page-layout editor-page-layout">{props.children}</div>
        </>
    );
}

export default EditorPageLayout;
