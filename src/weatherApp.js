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
    // const url1 = 'https://api.giphy.com/v1/gifs/translate?api_key=T5LsIn01axlEFNfHik4VPohk5Wz1no9W&s=hamster&weirdness=10'
    const GIPHY_KEY = 'T5LsIn01axlEFNfHik4VPohk5Wz1no9W'

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

    getGIF('sunny');

    PubSub.subscribe("searchStarted", getWeather);

    return {
        getWeather,
    }
})();

export default weatherApp.getWeather;