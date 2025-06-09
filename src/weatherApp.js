import PubSub from 'pubsub-js';

const weatherApp = (function() {
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
            precipprob: currentConditions.precipprob };
    }
    const API_KEY = "RQDHVRSVVH673VLFD6BX394TB"
    const getWeather = async function (_msg, location) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=RQDHVRSVVH673VLFD6BX394TB`
        const response = await fetch(url, {mode: 'cors'});
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            console.log(parseData(data));
        } else {
            console.log("something went wrong");
        }
    }

    PubSub.subscribe("searchStarted", getWeather);

    return {
        getWeather,
    }
})();

export default weatherApp.getWeather;