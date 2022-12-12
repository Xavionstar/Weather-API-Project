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

//This function runs the search history at the start 
updateSearchButtons()

//This fucntion calls up the weather in the city according to the weather API
function fetchCurrentWeatherData(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(queryURL, {
        method: "GET"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $searchedCityName.text(data.name + " " + (new Date()).toLocaleDateString());
            console.log(data)
            $searchedCityTemp.text(data.main.temp);
            $searchedCityWind.text(data.wind.speed);
            $searchedCityHumidity.text(data.main.humidity);
            $weatherIcon.html(`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" width="40" height="40">`)
        })
        .catch(function (error){
            alert("Error, not a city!")
        });
}
//This function calls up the weather for the next 5 days in said city
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
//This function takes the weather api forecast data and turns it to HTML 
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
//this function sets a searched city on the local storage
function addSearchedCity(city) {
    var searchHistory = getSearchHistory()
    searchHistory.unshift(city)
    if (searchHistory.length > 5) {
        searchHistory.pop()
    }
    localStorage.setItem("searchedCities", JSON.stringify(searchHistory));
}
//This function creates a button for each city searched
function updateSearchButtons() {
    $searchHistory.html("")
    var searchHistory = getSearchHistory()
    for (let i = 0; i < searchHistory.length; i++) {

        $searchHistory.append(`<li><button class="searchHistoryButton">${searchHistory[i]}</button></li>`)

    }
}
//this function pulls info from local storage to name the buttons
function getSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchedCities") || '[]');
    return searchHistory
}
//This button will allow you to repeat searches from the search history
$(document).on("click", ".searchHistoryButton", function (e) {
    var city =$(e.currentTarget).text();
    $cityInput.val(city)
    fetchCurrentWeatherData(city);
    fetchForecastWeatherData(city);
    addSearchedCity(city);
    updateSearchButtons();
})
//This button will get the weather for today, for the next 5 days, add it to search history and create a button that is useable to repeat a search
$searchButton.on("click", function () {
    var city = $cityInput.val();
    fetchCurrentWeatherData(city);
    fetchForecastWeatherData(city);
    addSearchedCity(city);
    updateSearchButtons();
});

