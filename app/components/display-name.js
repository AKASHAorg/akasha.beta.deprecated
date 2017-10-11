import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'antd';
import { getDisplayName } from '../utils/dataModule';

const DisplayName = (props) => {
    const { akashaId, ethAddress } = props;
    const name = getDisplayName({ akashaId, ethAddress });
    if (!akashaId) {
        return (
          <Tooltip overlayClassName="display-name__tooltip" title={ethAddress}>
            {name}
          </Tooltip>
        );
    }
    return <div>{name}</div>;
};

DisplayName.propTypes = {
    akashaId: PropTypes.string,
    ethAddress: PropTypes.string.isRequired,
};

export default DisplayName;
