import PubSub from 'pubsub-js';

const weatherApp = (function() {
    const API_KEY = "RQDHVRSVVH673VLFD6BX394TB"
    const GIPHY_KEY = 'T5LsIn01axlEFNfHik4VPohk5Wz1no9W'
    const tempSystem = {
        value: 'fahrenheit',
    }

    const catchErrors = function(fn) {
        return fn.catch((error) => {
            console.log(error);
        });
    };
    
    const parseData = function(data) {
        const currentConditions = data.currentConditions;
        return { temp: currentConditions.temp, 
            conditions: currentConditions.conditions, 
            feelslike: currentConditions.feelslike, 
            humidity: currentConditions.humidity, 
            precipprob: currentConditions.precipprob,
            location: data.address,
        };
    }

    const fahrenheitToCelsius = function (fahrenheit) {
        return ((fahrenheit - 32) * 5/9).toFixed(1);
    }

    const celsiusToFahrenheit = function (celsius) {
        return ((celsius * 9/5) + 32).toFixed(1);
    }

    const switchTemp = function (data) {
        let temp;
        let feelslike;
        if (tempSystem.value === 'fahrenheit') {
            temp = fahrenheitToCelsius(parseFloat(data.temp));
            feelslike = fahrenheitToCelsius(parseFloat(data.feelslike));
        } else if (tempSystem.value === 'celsius') {
            temp = celsiusToFahrenheit(parseFloat(data.temp));
            feelslike = celsiusToFahrenheit(parseFloat(data.feelslike));
        }
        PubSub.publish("updateTemps", {temp, feelslike});
    }

    const convertTemp = function (_msg, data) {
        if (tempSystem.value === 'fahrenheit') {
            switchTemp(data);
            tempSystem.value = 'celsius'
        } else if (tempSystem.value === 'celsius') {
            switchTemp(data);
            tempSystem.value = 'fahrenheit';
        }
    }

    const getWeather = async function (_msg, location) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${API_KEY}`
        const response = await fetch(url, {mode: 'cors'});
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            console.log(parseData(data));
            PubSub.publish("gotWeather", parseData(data));
        } else {
            console.log("something went wrong");
        }
    }

    const getGIF = async function (searchTerm) {
        const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_KEY}&s=${searchTerm}&weirdness=1`);
        if (response.ok) {
            const r = await response.json();
            console.log(r.data.images.original.url);
            PubSub.publish("gotGIF", r.data.images.original.url);
        } else {
            throw new Error("something went wrong");
        }

    }

    catchErrors(getGIF('sunny'));

    PubSub.subscribe("searchStarted", getWeather);
    PubSub.subscribe("changeTempSystem", convertTemp);

    return {
        getWeather,
    }
})();

export default weatherApp.getWeather;