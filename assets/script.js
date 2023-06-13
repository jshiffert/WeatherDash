// This is the script file
$('#main-window').height($(window).height() - $('#header').height());

var historyListEl = $('#search-history');
var searchHistory = [];

$(document).ready(function () {
    function storeHistory() {
        localStorage.setItem("citySearch", JSON.stringify(searchHistory));
    }
    
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
    
    function initHistory() {
        var storedHistory = JSON.parse(localStorage.getItem("citySearch"));
        if (storedHistory !== null) {
            searchHistory = storedHistory;
        }
    
        renderSearchHistory();
    };
    
    function runWeather(data) {
        var cityName = data.city.name;
        var current = data.list[0];
        var unix = current.dt * 1000;
        var dateObj = new Date(unix).toDateString();
        $('#city-title').text(cityName+', '+dateObj);
        var currTemp = current.main.temp;
        var currHumi = current.main.humidity;
        var currWind = current.wind.speed;
        var currIcon = current.weather[0].icon;
        $('#today-temp').text('Temp: '+currTemp+'°F');
        $('#today-wind').text('Wind: '+currWind+'mph');
        $('#today-humidity').text('Humidity: '+currHumi+'%');
        var iconUrl = "http://openweathermap.org/img/w/" + currIcon + ".png";
        $('#wicon').attr('src', iconUrl);
    };

    function run5day(data) {
        var row = $('#row5');
        row[0].innerHTML = "";
        for (i=7; i<40; i+=8) {
            var day = data.list[i];
            var dayCard = $('<div>');
            dayCard.addClass('card col-sm-2 m-3');
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
            row.append(dayCard);
        }
    };
    
    function getApi(searchInput) {
    
        fetch('https://api.openweathermap.org/data/2.5/forecast?q='+searchInput+'&units=imperial&appid=441acd7fa99ced9a050d8990bc2b7139')
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data);
            runWeather(data);
            run5day(data);
        });
    };
    
    $('#search-btn').click(function(){
        var searchInput = $('#search-input').val();
        if (searchInput === "") {
            return;
        }
    
        searchHistory.unshift(searchInput);
        $('#search-input').val("");
    
        storeHistory();
        renderSearchHistory();
        getApi(searchInput);
    })

    initHistory();

    $(document).on('click', '#history-item', function() {
        var searchInput = $(this)[0].textContent;
        getApi(searchInput);
    });
})


