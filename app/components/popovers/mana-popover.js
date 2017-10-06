import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, Popover, Progress, Tooltip } from 'antd';
import { RadarChart, ShiftDownForm } from '../';
import { selectBalance } from '../../local-flux/selectors';

const DEFAULT = 'default';
const SHIFT_DOWN = 'shiftDown';
const SHIFT_UP = 'shiftUp';

class ManaPopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible
        });

        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    page: DEFAULT
                });
            }, 100);
        }
    };

    onShiftDown = () => { this.setState({ page: SHIFT_DOWN }); };

    onShiftUp = () => { this.setState({ page: SHIFT_UP }); };

    onCancel = () => { this.setState({ page: DEFAULT }); };

    renderContent = () => {
        const { balance } = this.props;
        const { page } = this.state;
        const manaColor = 'rgba(48,179,33, 0.3)';

        if (page === SHIFT_DOWN) {
            return (
              <ShiftDownForm
                balance={balance}
                onCancel={this.onCancel}
                onShift={this.onShiftDownSubmit}
              />
            );
        }

        if (page === SHIFT_UP) {
            return <div>shift up</div>;
        }

        return (
          <div className="mana-popover__content">
            <div className="flex-center-x mana-popover__title">
              Mana
              <span className="mana-popover__mana-score">
                {balance.getIn(['mana', 'remaining'])}
              </span>
            </div>
            <div>
              <RadarChart
                data={{
                    labels: ['Publishing', 'Upvotes', 'Downvotes', 'Comments', 'Other'],
                    datasets: [{
                        data: [20, 10, 5, 14, 2],
                        backgroundColor: manaColor,
                    }]
                }}
                options={{
                    legend: { display: false },
                    scale: {
                        gridLines: {
                            circular: true
                        },
                        ticks: {
                            display: false,
                            maxTicksLimit: 5
                        },
                    },
                    tooltips: {
                        displayColors: false
                    }
                }}
                width={240}
                height={240}
              />
            </div>
            <div className="mana-popover__actions">
              <Button
                className="mana-popover__button"
                onClick={this.onShiftDown}
                size="large"
              >
                <Icon type="arrow-down" />
                Shift down
              </Button>
              <Button
                className="mana-popover__button"
                onClick={this.onShiftUp}
                size="large"
              >
                <Icon type="arrow-up" />
                Shift up
              </Button>
            </div>
          </div>
        );
    };

    render () {
        return (
          <Popover
            content={this.renderContent()}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="mana-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip title="Mana">
              <Progress
                className="mana-popover__progress"
                format={() => <Icon type="question-circle-o" />}
                percent={Math.random() * 100}
                strokeWidth={10}
                type="circle"
                width={32}
              />
            </Tooltip>
          </Popover>
        );
    }
}

ManaPopover.propTypes = {
    balance: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
    };
}

export default connect(mapStateToProps)(Form.create()(injectIntl(ManaPopover)));
