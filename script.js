// $ indicates jQuery method
// document ready is a jQuery method to ensure that document
// is finished loading before code runs
// (document) specifies the document object
// .ready specifies a function to run 
// when the document is fully loaded
$(document).ready(function () {
  // jquery method ".on" attaches an event handler function for 
  // one or more events, to the selected element(s).
  // the selected element in this case is the unique #id of #search-button
  // which is the search button in the index.html
  // one of the arguments of the .on method, is "click"
  // the other argument is an anonymous "callback" function
  // the on() method replaces bind(), live() and delegate() methods
  // in versions of jQuery before 1.7
  // TODO: explain callback functions here
  $("#search-button").on("click", function () {

    // set value of searchValue 
    // refers to index.html id="search-value"
    // .val() jQuery method is primarily used to get the values of form
    // elements such as input, select, and textarea
    // in this case it captures the name of the city 
    // and assigns it to searchValue
    var searchValue = $("#search-value").val();

    // clear input box
    // jQuery method to assign textContent of 
    // input field to empty string so that the city 
    // name entered disappears on enter, or click, or whatever
    $("#search-value").val("");

    // Calling the searchWeather function using the searchValue
    // variable as an argument to that function
    // this is the city name entered by the user
    searchWeather(searchValue);
  });

  // jQuery selects class history
  // listening for click on 
  // a previously entered city in an existing list
  $(".history").on("click", "li", function () {
    searchWeather($(this).text());
    //console.log($(this).text()); // displays the city clicked in console
  });

  // function makeRow receives the name of the city as an argument
  function makeRow(text) {

    // create li as list item variable
    // jQuery method to create in memory the open and close li HTML tags
    // for the current city (text argument) for any element that is of 
    // class .addClass
    // .text(text) inserts the city name between li tags <li>"City"</li>
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);

    // $(".history") jQuery method to target .history class items in index.html
    // .append(li) adds the assembled html element to for class .history tags before
    // the closing </ul> tag
    // because makeRow is called from a within a for loop, this assembled
    // element will be appended for each city as loop counter increments
    $(".history").append(li);
  }

  // called by .on click event
  // searchWeather takes one argument, searchValue
  function searchWeather(searchValue) {

    // ajax is asynchronous JavaScript and eXtensible Markup Language
    // XML format for receiving server data mostly replaced by more popular JSON format
    // jQuery method ajax specifies name value pairs (e.g. type: "GET")
    // necessary to query the API for information desired
    $.ajax({

      // The type of request to make, which can be either “POST” or “GET” url
      type: "GET",

      // Specifies the URL to send the request to
      // sending request to api.openweathermap.org
      // with the text value of searchValue (name of the city) variable
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=c8964eed8811dd75cc40e8ea60039298&units=imperial",

      // The data type expected of the server response.
      dataType: "json",

      // success function takes three arguments (result, status, xhr)
      // A function to be run when the request *succeeds*
      // in this case we're only using a single argument, result
      success: function (data) {

        // create history link for this search
        // if there is no previous city in the history array
        // TODO: analyze next line in more detail
        if (history.indexOf(searchValue) === -1) {
          //console.log(history.indexOf(searchValue));

          // appends to end of history array as next city
          history.push(searchValue);

          // store history array locally 
          // TODO: be more explicit
          window.localStorage.setItem("history", JSON.stringify(history));

          //function call to makeRow passing current city name
          makeRow(searchValue);
        }

        // clear any old content
        //jQuery method to void today id div in index.html
        $("#today").empty();

        // create html content for current weather
        // jQuery dynamically creating the card and placeholder variables
        // for text and image to appear inside the card

        // TODO: come back to this later
        // dynamically create tags, classes, text, image at #today id
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        // elements have been created above
        // now they are inserted to the appropriate location at #today id.
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        // display empty card on screen
        $("#today").append(card);

        // call follow-up api endpoints
        // make call to getForecase function, below, pass city as parameter
        getForecast(searchValue);
        TODO:
        // make call to getUVIndex function passing two arguments
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  // getForecast function takes in searchValue, the name of the current city
  function getForecast(searchValue) {
    console.log("Now inside the get Forecast Function!") // this displays in console!
    
    // this ajax method retrieves data for the city previously input searchValue
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial",
      dataType: "json",
      success: function (data) {
      
        // overwrite any existing content with title and empty row
        // create h4 element using jQuery
        // append assembled element at Forecast id 
        // backslashes are called escape characters, which cause the syntax to work as intended
        // assembles an html element, an h4 tag, inserts Bootstrap class mt-3 (margin top 3px) 
        // inserts all that at div class row in container-fluid in index.html   
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        // loop over all forecasts (by 3-hour increments)
        // create a for loop, start at zero, while counter is less than 
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");

            var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
            var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and put on page
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }
  // function called getUVIndex is expecting two variables returned to it
  // latitude and longitude
  function getUVIndex(lat, lon) {
    // jQuery method 
    $.ajax({
      type: "GET",
      // + lat and + lon are specified in the openweathermap api to retrieve 
      // retrieves lat and lon using coordinates based on searchValue variable which is the city name
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=7ba67ac190f85fdba2e2dc6b9d32e93c&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      // if ajax call returns code 200 then it is successful getting the lat lon coordinates
      // so if successful, it runs the function below
      // success is a property of the ajax method
      success: function (data) {
        // creating uv variable assigns paragraph element and inserts "UV Index: "
        var uv = $("<p>").text("UV Index: ");
        // creating btn variable and creates span tags and inserting bootstrap type of class and type of button
        // appending value of the uv index 
        // data.value is a range of numbers of the UV Index from 0 - 11
        // creates the button, adds the class and inserts text inside the button
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);

        // change color depending on uv value
        // references css to change btn color
        // if low UV index
        if (data.value < 3) {
        // adds a class called btn-success, these are bootstrap classes
          btn.addClass("btn-success");
        }
        // adds a class called btn-warning, these are bootstrap classes
        else if (data.value < 7) {
          btn.addClass("btn-warning");
        }
        else {
          // adds a class called btn-danger these are bootstrap classes
          // color changes are in CSS 
          btn.addClass("btn-danger");
        }
        // appends btn to html and appends the uv value to the btn
        // #today is id in the html
        // .card-body is a bootstrap class
        // .append will appends 
        // uv variable is "UV Index: " text
        // btn goes into the uv, uv goes into the card body 
        // card body goes into today id div
        $("#today .card-body").append(uv.append(btn));
      }
    });
  }

  // get current history, if any
  // assign value of history variable
  // JSON makes it possible to store JavaScript objects as text.
  // JSON.parse converts JSON string into an object
  // *Stringify* converts an object to a string so local 
  // storage can store it.
  // *Parse* TODO: figure out what parse does
  // TODO: figure out if history is an object or a string
  // CODE EXAMPLE below
  // Storing data:
  // myObj = {name: "John", age: 31, city: "New York"};
  // myJSON = JSON.stringify(myObj);
  // localStorage.setItem("testJSON", myJSON);
  // Retrieving data:
  // text = localStorage.getItem("testJSON");
  // obj = JSON.parse(text);
  // document.getElementById("demo").innerHTML = obj.name;
  // var history is an array of objects
  // history might end up as an empty array TODO:
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  // if history is not an empty array . . .
  if (history.length > 0) {
    // call the searchWeather function using 
    // the index of the length of the array -1
    // for example if the length of the array is 1
    // then searchWeather(history[0]);
    searchWeather(history[history.length - 1]);
  }

  // for loop starting at 0
  // as long as number of times through the loop is less than
  // the length of the history array do the stuff below, 
  // each time through the loop, increment counter by 1
  for (var i = 0; i < history.length; i++) {
    // call makeRow function with argument of current value
    // of history variable
    // so make a row for the current item in the history array
    // so each time through the loop, make new row for another city name
    makeRow(history[i]);
  }
});
