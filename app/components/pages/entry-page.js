// @flow strict

import * as React from "react";
import Route from "react-router-dom/Route";

/*:: type Props = {||}; */

function EntryPage (props /* : Props */) {
    return (
        <>
            <Route path="/@:akashaId/:entryId/:version?" render={() => <div>Entry Page with akashaID</div>} />
            <Route
                path="/0x:ethAddress/:entryId/:version?"
                render={() => <div>Entry Page with ETH Addr</div>}
            />
        </>
    );
}

export default EntryPage;
