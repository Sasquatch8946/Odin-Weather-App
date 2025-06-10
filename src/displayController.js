import PubSub from "pubsub-js";

const displayController = (function () {
  const startSearch = function (event) {
    if (event.type === "click" || event.key === "Enter") {
      event.preventDefault();
      const field = document.getElementById("location");
      const location = field.value;
      PubSub.publish("searchStarted", location);
      field.value = "";
    }
  };

  const activateSubmit = function () {
    console.log("FORM");
    console.log(document.querySelector("form"));
    const form = document.querySelector("form");
    form.addEventListener("submit", startSearch);
    const searchBar = document.querySelector("input[type='text']");
    searchBar.addEventListener("keydown", startSearch);
  };

  const insertGIF = function (_msg, url) {
    const img = document.querySelector(".weather-data img");
    img.src = url;
  };

  const changeLocation = function (location) {
    const titleDiv = document.querySelector(".weather-data .title");
    titleDiv.innerText = location;
  };

  const removeAllChildren = function (element) {
    while (element.lastElementChild) {
      element.removeChild(element.lastElementChild);
    }
  };

  const createTempDiv = function (data) {
    const { prefix, divClass, temp } = data;
    const tempDiv = document.createElement("div");
    const tempLabel = document.createTextNode(prefix);
    const tempSpan = document.createElement("span");
    tempSpan.innerText = temp;
    const tempPostfix = document.createTextNode("\xB0");
    tempDiv.appendChild(tempLabel);
    tempDiv.appendChild(tempSpan);
    tempDiv.appendChild(tempPostfix);
    tempDiv.classList.add(divClass);
    return tempDiv;
  };

  const insertWeatherData = function (_msg, data) {
    const container = document.querySelector(".weather-details");
    if (container.hasChildNodes()) {
      removeAllChildren(container);
    }
    const conditions = document.createElement("div");
    conditions.innerText = `Current conditions: ${data.conditions}`;
    const tempDiv = createTempDiv({
      prefix: "Temperature: ",
      divClass: "temp",
      temp: data.temp,
    });
    const feelslike = createTempDiv({
      prefix: "Feels like: ",
      divClass: "feelslike",
      temp: data.feelslike,
    });
    const precipprob = document.createElement("div");
    precipprob.innerText = `Chance of precipitation: ${data.precipprob}%`;
    const humidity = document.createElement("div");
    humidity.innerText = `Humidity: ${data.humidity}`;
    container.appendChild(conditions);
    container.appendChild(tempDiv);
    container.appendChild(feelslike);
    container.appendChild(precipprob);
    container.appendChild(humidity);
    changeLocation(data.location);
  };

  const changeTempSystem = function () {
    const temp = document.querySelector(".temp > span").innerText;
    const feelslike = document.querySelector(".feelslike > span").innerText;
    PubSub.publish("changeTempSystem", { temp, feelslike });
  };

  const activateTempToggle = function () {
    const toggle = document.querySelector(".temp-toggle span");
    toggle.addEventListener("click", changeTempSystem);
  };

  const updateTemps = function (_msg, data) {
    document.querySelector(".temp > span").innerText = data.temp;
    document.querySelector(".feelslike > span").innerText = data.feelslike;
  };

  PubSub.subscribe("gotGIF", insertGIF);
  PubSub.subscribe("gotWeather", insertWeatherData);
  PubSub.subscribe("updateTemps", updateTemps);
  activateTempToggle();

  return {
    activateSubmit,
  };
})();

export default displayController.activateSubmit;
