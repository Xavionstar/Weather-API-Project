var apiKey = "9f0d3b100c0f32b66b34fac20bdc8588";
var $cityInput = $("#inputBox");
var $forecastContainer = $("#forecastContainer");
var $searchButton = $("#searchButton");
var $searchedCityName = $("#searchedCityName");
var $searchedCityTemp = $("#searchedCityTemp");
var $searchedCityWind = $("#searchedCityWind");
var $searchedCityHumidity = $("#searchedCityHumidity");
var $searchHistory = $("#searchHistory");
var $searchHistoryButton = $(".searchHistoryButton")
var $weatherIcon = $("#weatherIcon")

updateSearchButtons()

function fetchCurrentWeatherData(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
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
            $weatherIcon.html(`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`)
        })
        .catch(function (error){
            alert("Error, not a city!")
        });
}
function fetchForecastWeatherData(city) {
    $forecastContainer.html("");
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
    fetch(queryURL, {
        method: "GET"

    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 3; i < data.list.length; i += 8) {
                var singleDayWeatherData = data.list[i];
                $forecastContainer.append(getSingleDayWeatherHtml(singleDayWeatherData));
            }
        })
        .catch(function (error){
            
        });
}
function getSingleDayWeatherHtml(singleDayWeatherData) {
    var singleDayWeatherHtml = $("<li/>");
    var singleDayWeatherDate = $(`<h3> ${singleDayWeatherData.dt_txt} <h3/>`);
    var singleDayWeatherIcon = $(`<img src="https://openweathermap.org/img/wn/${singleDayWeatherData.weather[0].icon}@2x.png">`);
    var singleDayForecast = $("<ul/>").addClass("forecastBox");
    singleDayForecast.append(`<li>Temperature: <strong>${singleDayWeatherData.main.temp}</strong></li>`);
    singleDayForecast.append(`<li>Wind Speed: <strong>${singleDayWeatherData.wind.speed}</strong></li>`);
    singleDayForecast.append(`<li>Humidity: <strong>${singleDayWeatherData.main.humidity}%</strong></li>`);

    singleDayWeatherHtml.append(singleDayWeatherDate);
    singleDayWeatherHtml.append(singleDayWeatherIcon);
    singleDayWeatherHtml.append(singleDayForecast);
    return singleDayWeatherHtml;
}

function addSearchedCity(city) {
    var searchHistory = getSearchHistory()
    searchHistory.unshift(city)
    if (searchHistory.length > 5) {
        searchHistory.pop()
    }
    localStorage.setItem("searchedCities", JSON.stringify(searchHistory));
}
function updateSearchButtons() {
    $searchHistory.html("")
    var searchHistory = getSearchHistory()
    for (let i = 0; i < searchHistory.length; i++) {

        $searchHistory.append(`<li><button class="searchHistoryButton">${searchHistory[i]}</button></li>`)

    }
}

function getSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchedCities") || '[]');
    return searchHistory
}

$(document).on("click", ".searchHistoryButton", function (e) {
    var city =$(e.currentTarget).text();
    $cityInput.val(city)
    fetchCurrentWeatherData(city);
    fetchForecastWeatherData(city);
    addSearchedCity(city);
    updateSearchButtons();
})

$searchButton.on("click", function () {
    var city = $cityInput.val();
    fetchCurrentWeatherData(city);
    fetchForecastWeatherData(city);
    addSearchedCity(city);
    updateSearchButtons();
});

