var apiKey = "9f0d3b100c0f32b66b34fac20bdc8588";
var $cityInput = $("#inputBox");
var $forecastContainer = $("#forecastContainer");
var $searchButton = $("#searchButton");
var $searchedCityName = $("#searchedCityName");
var $searchedCityTemp = $("#searchedCityTemp");
var $searchedCityWind = $("#searchedCityWind");
var $searchedCityHumidity = $("#searchedCityHumidity");

function fetchCurrentWeatherData() {
    var city = $cityInput.val();
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(queryURL, {
        method: "GET"

    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $searchedCityName.text(data.name);
            $searchedCityTemp.text(data.main.temp);
            $searchedCityWind.text(data.wind.speed);
            $searchedCityHumidity.text(data.main.humidity);
        });
}
function fetchForecastWeatherData(){
$forecastContainer.html("");
    var city = $cityInput.val();
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    fetch(queryURL, {
        method: "GET"

    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 3; i < data.list.length; i+= 8) {
                var singleDayWeatherData = data.list[i];
                $forecastContainer.append(getSingleDayWeatherHtml(singleDayWeatherData));
            }

           console.log(data);
        });
}
function getSingleDayWeatherHtml(singleDayWeatherData){
   var singleDayWeatherHtml = $("<li/>");
   var singleDayWeatherDate = $(`<h3> ${singleDayWeatherData.dt_txt} <h3/>`);
   var singleDayWeatherIcon = $("<i>*</i>");
var singleDayForecast = $("<ul/>").addClass("forecastBox");
singleDayForecast.append(`<li>Temperature: <strong>${singleDayWeatherData.main.temp}</strong></li>`);
singleDayForecast.append(`<li>Wind Speed: <strong>${singleDayWeatherData.wind.speed}</strong></li>`);
singleDayForecast.append(`<li>Humidity: <strong>${singleDayWeatherData.main.humidity}%</strong></li>`);

singleDayWeatherHtml.append(singleDayWeatherDate);
singleDayWeatherHtml.append(singleDayWeatherIcon);
singleDayWeatherHtml.append(singleDayForecast);
return singleDayWeatherHtml;
}

function addSearchedCity(city){
    var searchHistory = getSearchHistory()
    searchHistory.unshift(city)
    if (searchHistory.length>5) {
        searchHistory.pop()
    }
localStorage.setItem("searchedCities", JSON.stringify(searchHistory));
updateSearchButtons();
}


function getSearchHistory(){
    var searchHistory = json.parse(localStorage.getItem("searchedCities") || '[]');
    return searchHistory
}

$searchButton.on("click", function () {
    fetchCurrentWeatherData();
   fetchForecastWeatherData()
});

