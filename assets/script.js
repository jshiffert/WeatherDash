// This is the script file
$('#main-window').height($(window).height() - $('#header').height());

var historyListEl = $('#search-history');
var searchHistory = [];

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

$('#search-btn').click(function(){
    var searchInput = $('#search-input').val();
    if (searchInput === "") {
        return;
    }

    searchHistory.unshift(searchInput);
    $('#search-input').val("");

    storeHistory();
    renderSearchHistory();
})

initHistory();



