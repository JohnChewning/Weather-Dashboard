// API key for OpenWeatherMap
const apiKey = '26ba3a7e283acb9cd1e8665c6c3b319a';

// URLs for OpenWeatherMap API endpoints
const coordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';

// Selecting HTML elements using jQuery
const userFormEL = $('#city-search');
const col2El = $('.col2');
const cityInputEl = $('#city');
const fiveDayEl = $('#five-day');
const searchHistoryEl = $('#search-history');

// Current date using Day.js library
const currentDay = dayjs().format('M/DD/YYYY');

// URL for weather icons
const weatherIconUrl = 'http://openweathermap.org/img/wn/';

// Loading search history from local storag
const searchHistoryArray = loadSearchHistory();

// Function to convert a string to title case
function titleCase(str) {
	const splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}

// Function to load search history from local storag
function loadSearchHistory() {
	var searchHistoryArray = JSON.parse(localStorage.getItem('search history'));

	if (!searchHistoryArray) {
		searchHistoryArray = {
			searchedCity: [],
		};
	} else {
		for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
			searchHistory(searchHistoryArray.searchedCity[i]);
		}
	}

	return searchHistoryArray;
}

function saveSearchHistory() {
	localStorage.setItem('search history', JSON.stringify(searchHistoryArray));
};

// Function to display search history
function searchHistory(city) {
	const searchHistoryBtn = $('<button>')
		.addClass('btn')
		.text(city)
		.on('click', function () {
			$('#current-weather').remove();
			$('#five-day').empty();
			$('#five-day-header').remove();
			getWeather(city);
		})
		.attr({
			type: 'button'
		});

	searchHistoryEl.append(searchHistoryBtn);
}

// Function to get weather data for a city
function getWeather(city) {

	const apicoordinatesUrl = coordinatesUrl + city + '&appid=' + apiKey;

	// Fetching coordinates for the city
	fetch(apicoordinatesUrl)
		.then(function (coordinateResponse) {
			if (coordinateResponse.ok) {
				coordinateResponse.json().then(function (data) {
					const cityLatitude = data.coord.lat;
					const cityLongitude = data.coord.lon;

					const apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + apiKey + '&units=imperial';

					// Fetching one call data using coordinates
					fetch(apiOneCallUrl)
						.then(function (weatherResponse) {
							if (weatherResponse.ok) {
								weatherResponse.json().then(function (weatherData) {

									// ** CURRENT DAY DISPLAY ** //

									const currentWeatherEl = $('<div>')
										.attr({
											id: 'current-weather'
										})

									const weatherIcon = weatherData.current.weather[0].icon;
									const cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

									const currentWeatherHeadingEl = $('<h2>')
										.text(city + '  Today');
									const iconImgEl = $('<img>')
										.attr({
											id: 'current-weather-icon',
											src: cityCurrentWeatherIcon,
											alt: 'Weather Icon'
										})
									const currWeatherListEl = $('<ul>')

									const currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' mph', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

									for (var i = 0; i < currWeatherDetails.length; i++) {

										
										if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {

											const currWeatherListItem = $('<li>')
												.text('UV Index: ')

											currWeatherListEl.append(currWeatherListItem);

											const uviItem = $('<span>')
												.text(weatherData.current.uvi);

											if (uviItem.text() <= 2) {
												uviItem.addClass('favorable');
											}
											else if (uviItem.text() > 2 && uviItem.text() <= 7) {
												uviItem.addClass('moderate');
											}
											else {
												uviItem.addClass('severe');
											}

											currWeatherListItem.append(uviItem);

										} else {
											const currWeatherListItem = $('<li>')
												.text(currWeatherDetails[i])
											currWeatherListEl.append(currWeatherListItem);
										}

									}

									$('#five-day').before(currentWeatherEl);
									currentWeatherEl.append(currentWeatherHeadingEl);
									currentWeatherHeadingEl.append(iconImgEl);
									currentWeatherEl.append(currWeatherListEl);

									// ** 5-DAY FORECAST DISPLAY ** //

									const fiveDayHeaderEl = $('<h2>')
										.text('5-Day Forecast:')
										.attr({
											id: 'five-day-header'
										})

									$('#current-weather').after(fiveDayHeaderEl)

									const fiveDayArray = [];

									for (var i = 0; i < 5; i++) {
										let forecastDate = dayjs().add(i + 1, 'days').format('dddd');

										fiveDayArray.push(forecastDate);
									}

									for (var i = 0; i < fiveDayArray.length; i++) {

										const cardDivEl = $('<div>')
											.addClass('col3');

										const cardBodyDivEl = $('<div>')
											.addClass('card-body');

										const cardTitleEl = $('<h3>')
											.addClass('card-title')
											.text(fiveDayArray[i]);

										const forecastIcon = weatherData.daily[i].weather[0].icon;

										const forecastIconEl = $('<img>')
											.attr({
												src: weatherIconUrl + forecastIcon + '.png',
												alt: 'Weather Icon'
											});

										const currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' mph', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

										const tempEL = $('<p>')
											.addClass('card-text')
											.text('Temp: ' + weatherData.daily[i].temp.max + ' °F')
									
										const windEL = $('<p>')
											.addClass('card-text')
											.text('Wind: ' + weatherData.daily[i].wind_speed + ' mph')
									
										const humidityEL = $('<p>')
											.addClass('card-text')
											.text('Humidity: ' + weatherData.daily[i].humidity + '%')


										
										fiveDayEl.append(cardDivEl);
							
										cardDivEl.append(cardBodyDivEl);
										
										cardBodyDivEl.append(cardTitleEl);
										
										cardBodyDivEl.append(forecastIconEl);
										
										cardBodyDivEl.append(tempEL);
										
										cardBodyDivEl.append(windEL);
										
										cardBodyDivEl.append(humidityEL);
									}


								})
							}
						})
				});

			} else {
				alert('Error: Open Weather could not find city')
			}
		})

		.catch(function (error) {
			alert('Unable to connect to Open Weather');
		});
}

// Function to handle form submission for city search
function submitCitySearch(event) {
	event.preventDefault();
	const city = titleCase(cityInputEl.val().trim());
  
	if (city) {
	  // Fetching coordinates for the city
	  const apicoordinatesUrl = coordinatesUrl + city + '&appid=' + apiKey;
	  
	  fetch(apicoordinatesUrl)
		.then(function (coordinateResponse) {
		  if (coordinateResponse.ok) {
			coordinateResponse.json().then(function (data) {
			  // If coordinates are found, proceed to get weather data
			  getWeather(city);
			  searchHistory(city);
			  searchHistoryArray.searchedCity.push(city);
			  saveSearchHistory();
			  cityInputEl.val('');
			});
		  } else {
			// If OpenWeatherMap doesn't find the city, show an alert and don't add it to the search history
			alert('Error: Open Weather could not find city');
		  }
		})
		.catch(function (error) {
		  alert('Unable to connect to Open Weather');
		});
	}
  }
  

// Event listener for form submission
userFormEL.on('submit', submitCitySearch);

// Event listener for clearing weather data on button click
$('#search-btn').on('click', function () {
	$('#current-weather').remove();
	$('#five-day').empty();
	$('#five-day-header').remove();
})