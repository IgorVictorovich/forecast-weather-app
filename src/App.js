import React, { Component } from 'react';
import { ForecastService, CountryService } from './Service';
import CountryList from './CountryList';
import ForecastList from './ForecastList';

const ForecastMainObject = {
    temp: "",
    temp_min: "",
    temp_max: "",
    pressure: "",
    humidity: ""
};

class App extends Component {


    constructor(props) {
        super(props);

        this.state = {
            isForecastReceived: false,
            weatherForecast: {main: ForecastMainObject},
            weatherForecastByDate: {},
            weatherForecastByDateList: [],
            forecastModeByDate: false,
            cityName: '',
            countryCode: '',
            countryCodes: [],
            isError: false,
            errorText: '',
            errorLevel: 'alert-info'
        };
    }

    getForecast = () => {
        if (this.state.forecastModeByDate) {
            return ForecastService.getForecastedWeatherByCityName(this.state.cityName, this.state.countryCode);
        }
        return ForecastService.getWeatherByCityName(this.state.cityName, this.state.countryCode);
    };

    hideUIError = () => {
        this.setState({
            isError: false,
            errorText: ''
        });
    };

    showUIError = (text, isInfo) => {
        text = text || 'something went wrong :(';

        this.setState({
            isError: true,
            errorText: text,
            errorLevel: isInfo ? 'alert-info' : 'alert-danger'
        });
    };

    getForecastBtnClick = () => {
        this.hideUIError();

        if (!this.state.cityName || !this.state.countryCode) {
            this.showUIError("Please fill country and/or city", true);
            return;
        }
        this.getForecast()
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(json => {
                            if (json.cod !== "200" && json.cod !== 200) {
                                this.showUIError();
                                console.error(json);
                            }
                            if (this.state.forecastModeByDate) {
                                this.setState({
                                    weatherForecastByDate: json,
                                    weatherForecastByDateList: json.list,
                                    isForecastReceived: true
                                });
                            } else {
                                this.setState({
                                    weatherForecast: json,
                                    isForecastReceived: true
                                });
                            }
                        });
                }
            })
            .catch(error => {
                this.showUIError();
                console.error('request failed', error);
            });
    };

    componentDidMount = () => {
        CountryService.getCountryCodes()
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(json => {
                            this.setState({countryCodes: json});
                        });
                }
            })
            .catch(error => {
                this.showUIError();
                console.error('request failed', error);
            });
    };

    handleInputChange = (event, customValue) => {
        const target = event.target;
        const value = customValue || target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    handleCountryChange = (event) => {
        const target = event.target;
        const value = target.value;
        let countryCode = CountryList.getCodeByName(value, this.state.countryCodes);

        this.setState({
            countryCode: countryCode
        });
    };

    forecastSelectorClick = (event) => {
        this.setState({
            forecastModeByDate: event.target && event.target.name !== "currentWeatherButton",
            isForecastReceived: false,
            weatherForecast: {main: ForecastMainObject},
            weatherForecastByDate: {},
            weatherForecastByDateList: []
        });
    };

    getRandomKey = () => {
        return Math.random() * 100;
    };

    render() {
        return (
          <div className="App">
            <div className="weather-forecast-input-form">
                <form>
                    <div className="form-group">
                        <label htmlFor="cityName">City:</label>
                        <input type="text"
                               name="cityName"
                               value={this.state.cityName}
                               onChange={this.handleInputChange}
                               className="form-control" id="cityName"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="countryCode">Country code:</label>
                        <input type="text"
                               disabled={true}
                               name="countryCode"
                               value={this.state.countryCode}
                               className="form-control" id="countryCode"/>
                    </div>

                    <CountryList
                        countries={this.state.countryCodes}
                        countryCode={this.state.countryCode}
                        onCountryChange={this.handleCountryChange}
                    />
                    <label htmlFor="forecastSelectorBtnGroup">Select forecast mode</label>
                    <div id="forecastSelectorBtnGroup" className="wheather-forecast-mode-selector">
                        <div  className="btn-group" role="group" aria-label="">
                            <button type="button"
                                    name="currentWeatherButton"
                                    className="btn btn-default"
                                    onClick={this.forecastSelectorClick}
                            >Current weather</button>
                            <button type="button"
                                    className="btn btn-default"
                                    name="forecastedWeatherButton"
                                    onClick={this.forecastSelectorClick}
                            >5 day / 3 hour forecast</button>
                        </div>
                    </div>

                    <button type="button"
                            className="btn btn-default"
                            name="ForecastBtn"
                            onClick={this.getForecastBtnClick}>Search</button>
                    <div id="uiErrorMessage" className={'alert ' + this.state.errorLevel} hidden={!this.state.isError}>
                        <strong>{this.state.errorLevel === 'alert-danger' ? 'Error! ' : 'Info! ' }</strong>
                        {this.state.errorText}
                    </div>
                </form>
            </div>
            <div className="weather-forecast-result"
                 id="weatherForecastResult"
                 hidden={!(this.state.isForecastReceived && !this.state.forecastModeByDate)}>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temperature, °C</th>
                        <th>Minimum temperature, °C</th>
                        <th>Maximum temperature, °C</th>
                        <th>Atmospheric pressure, hPa</th>
                        <th>Humidity, %</th>
                    </tr>
                    </thead>
                    <tbody>
                    <ForecastList key={this.getRandomKey()}
                                  keyValue={this.getRandomKey()}
                                  dataValue={this.state.weatherForecast} />
                    </tbody>
                </table>
            </div>
            <div className="weather-forecast-result"
                 id="weatherFiveDaysForecastResult"
                 hidden={this.state.isForecastReceived && !this.state.forecastModeByDate}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temperature, °C</th>
                            <th>Minimum temperature, °C</th>
                            <th>Maximum temperature, °C</th>
                            <th>Atmospheric pressure, hPa</th>
                            <th>Humidity, %</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.weatherForecastByDateList.map((dataItem) => {
                            return (
                                <ForecastList key={this.getRandomKey()}
                                              keyValue={this.getRandomKey()}
                                              dataValue={dataItem} />
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>

          </div>
        );
  }
}

export default App;
