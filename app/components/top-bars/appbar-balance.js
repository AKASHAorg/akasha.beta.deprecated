// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';
import { profileGetBalance } from '../../local-flux/actions/profile-actions';
import { Balance } from '../';
import { profileSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

/*::
    type Props = {|
        dispatchAction: Function,
        balance: Object,
        loggedEthAddress: string,
    |};
*/

function AppbarBalance (props /* : Props */) {
    const { dispatchAction, getActionStatus, balance, loggedEthAddress } = props;
    React.useEffect(() => {
        console.log('effect');
        dispatchAction(
            profileGetBalance(),
            newState => loggedEthAddress !== null && balance.get('eth') === null
        );
    }, [loggedEthAddress]);
    return <div>{balance.get('eth')} ETH</div>;
}
const mapStateToProps = state => ({
    balance: profileSelectors.selectBalance(state),
    loggedEthAddress: profileSelectors.selectLoggedEthAddress(state)
});

export default connect(mapStateToProps)(withRequest(AppbarBalance));
