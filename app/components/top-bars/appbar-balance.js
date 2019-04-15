// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import { profileGetBalance } from '../../local-flux/actions/profile-actions';
import { Balance } from '../';
import { profileActions } from '../../local-flux/actions';
import { profileSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';
import { useTogglerWithClickAway } from '../../utils/clickAway';
import { APPBAR_SLOTS } from '../layouts/slot-names';
import { EthWallet, AethWallet } from '../';

/*::
    type Props = {|
        dispatchAction: Function,
        balance: Object,
        loggedEthAddress: string,
    |};
*/

function AppbarBalance (props /* : Props */) {
    const { dispatchAction, getActionStatus, balance, loggedEthAddress } = props;

    const ethBalanceToggler = React.useRef(null);
    const ethPanelRef = React.useRef(null);
    const aethBalanceToggler = React.useRef(null);
    const aethPanelRef = React.useRef(null);

    const { getCurrentProfile } = profileActions;
    const { getMainBalance } = profileSelectors;
    const [ethPanelOpen, setEthPanelOpen] = React.useState(false);
    const [aethPanelOpen, setAethPanelOpen] = React.useState(false);

    React.useEffect(() => {
        dispatchAction(
            profileGetBalance(),
            newState =>
                getActionStatus(getCurrentProfile().type) !== 'pending' &&
                loggedEthAddress !== null &&
                getMainBalance(newState) === null
        );
    }, [loggedEthAddress]);

    useTogglerWithClickAway(ethBalanceToggler, ethPanelRef, setEthPanelOpen, ethPanelOpen);
    useTogglerWithClickAway(aethBalanceToggler, aethPanelRef, setAethPanelOpen, aethPanelOpen);
    return (
        <>
            <div className="appbar-balance">
                <Balance
                    elRef={ethBalanceToggler}
                    balance={balance.get('balance')}
                    short
                    type={`${balance.get('unit')}_symbol`}
                />
                <Balance
                    elRef={aethBalanceToggler}
                    balance={balance.getIn(['aeth', 'free'])}
                    short
                    type="aeth"
                />
            </div>
            {ethPanelOpen && (
                <Fill name={APPBAR_SLOTS.RIGHT_PANEL}>
                    <div ref={ethPanelRef} className="eth-panel">
                        <EthWallet />
                    </div>
                </Fill>
            )}

            {aethPanelOpen && (
                <Fill name={APPBAR_SLOTS.RIGHT_PANEL}>
                    <div ref={aethPanelRef} className="eth-panel">
                        <AethWallet />
                    </div>
                </Fill>
            )}
        </>
    );
}
const mapStateToProps = state => ({
    balance: profileSelectors.selectBalance(state),
    loggedEthAddress: profileSelectors.selectLoggedEthAddress(state)
});

export default connect(mapStateToProps)(withRequest(AppbarBalance));
