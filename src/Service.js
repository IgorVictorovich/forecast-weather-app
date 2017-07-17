import 'whatwg-fetch';

const COUNTRY_CODE_URL = "https://restcountries.eu/rest/v2";

const API_KEY = "f7f297a17a5776db997bfba84c7bd234";
const FORECAST_URL = "http://api.openweathermap.org/data/2.5/";

const UNITS_CELSIUS = "&units=metric";
const UNITS_FAHRENHEIT  = "units=imperial";

const CURRENT_WEATHER = "weather";
const FORECASTED_WEATHER = "forecast";

export class CountryService {

    static getCountryCodes() {
        let payload = "all?fields=name;alpha2Code";
        return fetch(`${COUNTRY_CODE_URL}/${payload}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
    }
}

export class ForecastService {

    static getQueryString(payload, useMetricalSystem, currentWeather) {
        let units = useMetricalSystem
            ? UNITS_CELSIUS
            : UNITS_FAHRENHEIT;
        let mode = currentWeather
            ? CURRENT_WEATHER
            : FORECASTED_WEATHER;


        return `${FORECAST_URL}${mode}?${payload}${units}&appid=${API_KEY}`;
    }

    static getRequest(queryString) {
        return fetch(queryString, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
    }

    static getWeatherByCityName(city, country) {
        const query = `q=${city},${country}`;
        return ForecastService.getRequest(ForecastService.getQueryString(query, true, true));
    }

    static getForecastedWeatherByCityName(city, country) {
        const query = `q=${city},${country}`;
        return ForecastService.getRequest(ForecastService.getQueryString(query, true, false));
    }
}