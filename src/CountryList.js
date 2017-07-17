import React, { Component } from 'react';

class CountryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cityName: ''
        };
    }

    static getCodeByName(country, list) {
        let data = list.find((item) => {
            return item.name === country;
        });

        return data ? data.alpha2Code : null;
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        this.props.onCountryChange(event);
    };

    render() {
        return (
            <div className="form-group">
                <label htmlFor="sel1">Country:</label>
                <select className="form-control"
                        id="sel1"
                        value={this.state.cityName}
                        name="cityName"
                        onChange={this.handleInputChange}>
                    <option key={1} id={"UA"} disabled={true}>
                        Please select country
                    </option>
                    {this.props.countries.map((code) =>
                        <option key={code.alpha2Code} id={code.alpha2Code}>
                            {code.name}
                        </option>
                    )}
                </select>
            </div>
        );
    }
}

export default CountryList