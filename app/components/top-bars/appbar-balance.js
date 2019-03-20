// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';
import { profileGetBalance } from '../../local-flux/actions/profile-actions';
import { Balance } from '../';
import withRequest from '../high-order-components/with-request';

/*::
    type Props = {|
        dispatchAction: Function,
        balance: Object
    |};
*/

function AppbarBalance (props /* : Props */) {
    const { dispatchAction, balance } = props;
    React.useEffect(() => {
        dispatchAction(profileGetBalance(), balance.get('eth') === null);
    }, []);
    return <div>{balance.get('eth')} ETH</div>;
}
const mapStateToProps = state => ({
    balance: state.profileState.get('balance')
});

export default connect(mapStateToProps)(withRequest(AppbarBalance));
