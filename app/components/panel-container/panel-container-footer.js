import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'antd';
import styles from './panel-container-footer.scss';

const PanelContainerFooter = (props) => {
    const { footerHeight, children, leftActions, className } = props;
    return (
        <Row
            type="flex"
            className={ `${ styles.root } ${ className }` }
        >
            <Col span={ 6 } className={ `${ styles.leftActions }` }>
                { leftActions }
            </Col>
            <Col span={ 18 } className={ `${ styles.rightActions }` }>
                <Row type="flex" justify="end">
                    { children }
                </Row>
            </Col>
        </Row>
    );
};

PanelContainerFooter.propTypes = {
    footerHeight: PropTypes.number,
    children: PropTypes.node,
    leftActions: PropTypes.node,
    className: PropTypes.string,
};
PanelContainerFooter.defaultProps = {
    footerHeight: 60
};
export default PanelContainerFooter;
