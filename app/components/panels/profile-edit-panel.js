// @flow strict

import * as React from 'react';

/* :: type Props = {||}; */

function ProfileEditPanel (props /* : Props */) {
    const { visible } = props;
    if (!visible) {
        return null;
    }
    return <div>Profile edit panel</div>;
}

export default ProfileEditPanel;
