import React, { Component } from 'react';

export class ForecastList extends Component {
    constructor(props) {
        super(props);

        let convertedDate =
            this.getDate(this.props.dataValue.dt_txt || this.props.dataValue.dt);

        this.state = {
            forecastDate: convertedDate
        };
    }

    getFormattedDate = (date) => {
        return date.toGMTString();
    };

    getDate = (value) => {
        if (typeof value === "number") {
            return this.getFormattedDate(new Date(value * 1000));
        }
        return this.getFormattedDate(new Date(value));
    };

    getRandomKey = () => {
        return Math.random() * 100000;
    };

    render() {
        return (
            <tr key={this.getRandomKey()}>
                <td>{this.state.forecastDate}</td>
                <td>{this.props.dataValue.main.temp}</td>
                <td>{this.props.dataValue.main.temp_min}</td>
                <td>{this.props.dataValue.main.temp_max}</td>
                <td>{this.props.dataValue.main.pressure}</td>
                <td>{this.props.dataValue.main.humidity}</td>
            </tr>
        );
    }
}

export default ForecastList