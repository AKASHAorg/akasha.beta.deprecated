import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const NavigateAway = (props) => {
    const { navigation, onClick } = props;
    return (
      <Modal
        onOk={() => {
            window.location.href = navigation.get('url');
            onClick();
        }}
        onCancel={() => onClick()}
        closable={false}
        visible={navigation.get('isVisible')}
        okText={'Ok'}
        cancelText={'Cancel'}
        title={'Wait a second...'}
      >
        You are about to navigate to an external url
        <div>{navigation.get('url')}</div>
      </Modal>
    );
};

NavigateAway.propTypes = {
    navigation: PropTypes.shape().isRequired,
    onClick: PropTypes.func,
};

export default NavigateAway;
