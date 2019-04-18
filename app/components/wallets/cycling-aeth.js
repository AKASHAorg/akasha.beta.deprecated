import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Spin } from 'antd';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { balanceToNumber } from '../../utils/number-formatter';

const CyclingAeth = ({ cyclingStates, intl, onCollect, pendingCycleAeth, pendingFreeAeth }) => {
    const availableTotal = balanceToNumber(cyclingStates.getIn(['available', 'total']));
    const disabled = pendingFreeAeth || !availableTotal || !Number(availableTotal);
    const pendingStates = cyclingStates.getIn(['pending', 'collection']);
    const formatDate = (date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        day = day < 10 ? `0${ day }` : day;
        month = month < 10 ? `0${ month }` : month;
        return `${ day }.${ month }.${ date.getFullYear() }`;
    };
    const className = classNames('cycling-aeth__collect-button', {
        'content-link': !disabled,
        'cycling-aeth__collect-button_disabled': disabled
    });

    return (
        <div className="cycling-aeth">
            <div className="cycling-aeth__inner">
                <div className="cycling-aeth__title">
                    { intl.formatMessage(profileMessages.cyclingComplete) }
                </div>
                <div>
                    { intl.formatMessage(profileMessages.cycledAmountAvailable, { amount: availableTotal }) }
                    <span className={ className } onClick={ disabled ? undefined : onCollect }>
              { pendingFreeAeth && <Spin size="small"/> }
                        { intl.formatMessage(generalMessages.collect) }
            </span>
                </div>
                <div className="cycling-aeth__title">
                    { intl.formatMessage(profileMessages.cyclingProcess) }
                </div>
                { !pendingStates.length &&
                <div className="flex-center cycling-aeth__placeholder">
                    <div className="cycling-aeth__placeholder-image"/>
                    <div
                        className="cycling-aeth__placeholder-text"
                    >
                        { intl.formatMessage(profileMessages.cyclingPlaceholder) }
                    </div>
                </div>
                }
                { (!!pendingStates.length || !!pendingCycleAeth) &&
                <div className="cycling-aeth__table">
                    <div className="flex-center-y cycling-aeth__header">
                        <div className="cycling-aeth__cell">
                            { intl.formatMessage(generalMessages.amount) }
                        </div>
                        <div className="cycling-aeth__cell">
                            { intl.formatMessage(generalMessages.counter) }
                        </div>
                    </div>
                    { !!pendingCycleAeth &&
                    <div key="pending-cycle" className="flex-center-y cycling-aeth__row">
                        <div className="cycling-aeth__cell">
                            { pendingCycleAeth } AETH
                        </div>
                        <div className="flex-center-y cycling-aeth__cell">
                            <Spin size="small"/>
                        </div>
                    </div>
                    }
                    { pendingStates.map(cycle => (
                        <div key={ cycle.unlockDate } className="flex-center-y cycling-aeth__row">
                            <div className="cycling-aeth__cell">
                                { balanceToNumber(cycle.amount) } AETH
                            </div>
                            <div className="cycling-aeth__cell">
                                { formatDate(new Date(cycle.unlockDate * 1000)) }
                            </div>
                        </div>
                    )) }
                </div>
                }
            </div>
        </div>
    );
};

CyclingAeth.propTypes = {
    cyclingStates: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    onCollect: PropTypes.func.isRequired,
    pendingCycleAeth: PropTypes.string,
    pendingFreeAeth: PropTypes.bool
};

export default injectIntl(CyclingAeth);
