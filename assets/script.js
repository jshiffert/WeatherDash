// fill window with main content
$('#main-window').height($(window).height() - $('#header').height());

// emtpy variables
var historyListEl = $('#search-history');
var searchHistory = [];

// wrap in document
$(document).ready(function () {
    // store history
    function storeHistory() {
        localStorage.setItem("citySearch", JSON.stringify(searchHistory));
    }
    // fill search history section
    function renderSearchHistory() {
        historyListEl[0].innerHTML = "";
        
        for (var i = 0; i < searchHistory.length; i++) {
            if (i < 8) {
                var item = searchHistory[i];
                var ael = document.createElement("button");
                $(ael).addClass("list-group-item list-group-item-action");
                ael.setAttribute("type", "button");
                ael.setAttribute("id", "history-item");
                ael.textContent = item;
                historyListEl[0].appendChild(ael);
            }
        }
    }
    // initialize history on page load
    function initHistory() {
        var storedHistory = JSON.parse(localStorage.getItem("citySearch"));
        if (storedHistory !== null) {
            searchHistory = storedHistory;
        }
    
        renderSearchHistory();
    };
    // current weather display
    function runWeather(data) {
        // get variables from api response
        var cityName = data.city.name;
        var current = data.list[0];
        var unix = current.dt * 1000;
        var dateObj = new Date(unix).toDateString();
        $('#city-title').text(cityName+', '+dateObj);
        var currTemp = current.main.temp;
        var currHumi = current.main.humidity;
        var currWind = current.wind.speed;
        var currIcon = current.weather[0].icon;
        // display weather
        $('#today-temp').text('Temp: '+currTemp+'°F');
        $('#today-wind').text('Wind: '+currWind+'mph');
        $('#today-humidity').text('Humidity: '+currHumi+'%');
        // icon url display
        var iconUrl = "http://openweathermap.org/img/w/" + currIcon + ".png";
        $('#wicon').attr('src', iconUrl);
    };
    // run the 5 day forecast
    function run5day(data) {
        // get and clear the 5 day row
        var row = $('#row5');
        row[0].innerHTML = "";
        // loop through api response data
        for (i=7; i<40; i+=8) {
            var day = data.list[i];
            // create a card
            var dayCard = $('<div>');
            dayCard.addClass('card col-sm-2 m-3');
            // add data to card
            var dateText = $('<h3>');
            var dayUnix = day.dt * 1000;
            var dateObj = new Date(dayUnix).toDateString();
            dateText.text(dateObj);
            dayCard.append(dateText);
            var dayIcon = day.weather[0].icon;
            var iconEl = $('<img>');
            var iconUrl = "http://openweathermap.org/img/w/" + dayIcon + ".png";
            iconEl.attr('src', iconUrl);
            iconEl.addClass("img-thumbnail");
            dayCard.append(iconEl);
            var tempEl = $('<p>');
            var dayTemp = day.main.temp;
            tempEl.text('Temp: '+dayTemp+'°F');
            dayCard.append(tempEl);
            var windEl = $('<p>');
            var dayWind = day.wind.speed;
            windEl.text('Wind: '+dayWind+'mph');
            dayCard.append(windEl);
            var humiEl = $('<p>');
            var dayHumi = day.main.humidity;
            humiEl.text('Humidity: '+dayHumi+'%');
            dayCard.append(humiEl);
            // append card to row
            row.append(dayCard);
        }
    };
    // api call
    function getApi(searchInput) {
    
        fetch('https://api.openweathermap.org/data/2.5/forecast?q='+searchInput+'&units=imperial&appid=441acd7fa99ced9a050d8990bc2b7139')
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            // run weather functions
            runWeather(data);
            run5day(data);
        });
    };
    // search button click
    $('#search-btn').click(function(){
        var searchInput = $('#search-input').val();
        if (searchInput === "") {
            return;
        }
        // add input to history
        searchHistory.unshift(searchInput);
        $('#search-input').val("");
        // run functions for history and api fetch
        storeHistory();
        renderSearchHistory();
        getApi(searchInput);
    })
    // alternative way to search with enter
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            var searchInput = $('#search-input').val();
            if (searchInput === "") {
                return;
            }
        
            searchHistory.unshift(searchInput);
            $('#search-input').val("");
        
            storeHistory();
            renderSearchHistory();
            getApi(searchInput);
        }
    });
    // initialization function
    initHistory();
    // history item click action
    $(document).on('click', '#history-item', function() {
        var searchInput = $(this)[0].textContent;
        getApi(searchInput);
    });
})


