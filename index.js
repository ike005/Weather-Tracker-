import dotenv from 'dotenv';
dotenv.config();

const zipCodeContainer = document.getElementById('changing-container');
const weatherContainer = document.getElementById('display-info-container');
const userZipCode = document.getElementById('zip-code-value');
const changeLocationButton = document.getElementById('change-location');
const submitZipCodeButton = document.getElementById('zip-code-button');

const zipCodeError = document.getElementById('zip-code-error');


function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}

openWeatherApiKey = ""
async function getWeatherInfo(zipCode) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${openWeatherApiKey}`);
    const data = await response.json();
    const cityName = data.name;
    const countryName = data.sys.country;

    const currentTempF = parseFloat(kelvinToFahrenheit(data.main.temp).toFixed(2));
    const feelsLikeF = parseFloat(kelvinToFahrenheit(data.main.feels_like).toFixed(2));
    const maxTempF = parseFloat(kelvinToFahrenheit(data.main.temp_max).toFixed(2));
    const minTempF = parseFloat(kelvinToFahrenheit(data.main.temp_min).toFixed(2));

    return {cityName, countryName, currentTempF, feelsLikeF, maxTempF, minTempF};
}


async function getLocationInfo(zipCode) {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    const data = await response.json();
    const stateAbbrevation = data.places[0]["state abbreviation"];

    return stateAbbrevation;
}

submitZipCodeButton.addEventListener('click', async function () {
    const zipCode = userZipCode.value.trim(); // <-- read here

    if (zipCode === "") {
        zipCodeContainer.style.display = 'flex';
        weatherContainer.style.display = 'none';
        zipCodeError.style.display = 'flex';
        return;
    }

    zipCodeError.style.display = 'none';
    zipCodeContainer.style.display = 'none';
    weatherContainer.style.display = 'flex';

    const cityWeatherInfo = await getWeatherInfo(zipCode);
    const cityAbbrevation = await getLocationInfo(zipCode);

    if (cityWeatherInfo.currentTempF > 60){
        document.getElementById('current-temperature').style.color = 'red';
    } else if (cityWeatherInfo.currentTempF > 40){
        document.getElementById('current-temperature').style.color = 'orange';
    } else if (cityWeatherInfo.currentTempF <= 40){
        document.getElementById('current-temperature').style.color = '#7490C7';
    }

    document.getElementById('city-name').innerHTML = `${cityWeatherInfo.cityName}, ${cityAbbrevation}`;
    document.getElementById('current-temperature').innerHTML = `${cityWeatherInfo.currentTempF}°F`;
    document.getElementById('feel-temperature').innerHTML = `Feels Like: ${cityWeatherInfo.feelsLikeF}°F`;
    document.getElementById('low-range').innerHTML = `Low: ${cityWeatherInfo.minTempF}°F`;
    document.getElementById('high-range').innerHTML = `High: ${cityWeatherInfo.maxTempF}°F`;

    userZipCode.value = "";
});

changeLocationButton.addEventListener('click', function(){
    weatherContainer.style.display = 'none';
    zipCodeContainer.style.display = 'flex';
});


// grab the user's input by using .value and use the zipcode to get the longitude and latitude
// using this longitude and latitude use it to get the weather from that location

//initiate switch container content based on if the button is clicked
//also add a validation process where it checks for click and if the input is valid