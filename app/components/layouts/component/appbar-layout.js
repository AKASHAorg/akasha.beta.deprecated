// @flow strict

import * as React from 'react';
import { Slot } from 'react-slot-fill';
import { APPBAR_SLOTS } from '../slot-names';
/*:: type Props = {||}; */

function AppBarLayout (/* props /* : Props */) {
    return (
        <>
            <div className="appbar-layout appbar-layout_top">
                <div className="appbar-layout_left-slot">
                    <Slot name={APPBAR_SLOTS.LEFT} />
                </div>
                <div className="appbar-layout_right-slot">
                    <Slot name={APPBAR_SLOTS.SERVICE_STATUS} />
                    <Slot name={APPBAR_SLOTS.NOTIFICATION} />
                    <Slot name={APPBAR_SLOTS.WALLET} />
                </div>
            </div>
            <div className={`appbar-right-panel`}>
                {/*  only one panel can be open at a time' */}
                <Slot name={APPBAR_SLOTS.RIGHT_PANEL} />
            </div>
        </>
    );
}

export default AppBarLayout;
