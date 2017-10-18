import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from 'chart.js';
import { fromJS } from 'immutable';

class PieChart extends Component {
    state = {
        chart: null
    };

    componentDidMount () {
        const myChart = new Chart(this.canvas, {
            type: 'pie',
            data: this.props.data,
            options: this.props.options
        });
        this.setState({ chart: myChart }); // eslint-disable-line
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { data, options } = nextProps;
        if (
            !fromJS(data).equals(fromJS(this.props.data)) ||
            !fromJS(options).equals(fromJS(this.props.options)) ||
            nextState.chart !== this.state.chart
        ) {
            return true;
        }
        return false;
    }

    componentDidUpdate () {
        const { data } = this.props;
        const { chart } = this.state;
        data.datasets.forEach((dataset, i) => { chart.data.datasets[i].data = dataset.data; });

        chart.data.labels = data.labels;
        chart.update();
    }

    componentWillUnmount () {
        const { chart } = this.state;
        chart.destroy();
    }

    getCanvasRef = (el) => { this.canvas = el; };

    render () {
        const { data, options, ...other } = this.props;
        return (
          <canvas ref={this.getCanvasRef} {...other} />
        );
    }
}

PieChart.defaultProps = {
    options: {}
};

PieChart.propTypes = {
    data: PropTypes.shape(),
    options: PropTypes.shape()
};

export default PieChart;
