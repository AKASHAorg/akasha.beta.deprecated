// @flow strict

import * as React from 'react';
import { Route } from 'react-router-dom';

/*:: type Props = {||}; */

function SearchPage (props /* : Props */) {
    return (
        <>
            <Route path="/search" render={ () => <>Search Page</> }/>
        </>
    );
}

export default SearchPage;
