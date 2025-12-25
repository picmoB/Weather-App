// ============================================================
// Get current location
// ============================================================

function getCurrentPositionAsync() {
    return new Promise((resolve, reject) => {
        function reject() {
            // Notify user if disabled
            alert("Detecting current location is disabled.\nUsing default search location! 🌐");

            // Use default search option
            document.getElementById("search").value = "Berlin";
            fetchAPI();
        }

        navigator.geolocation.getCurrentPosition(
            resolve, 
            reject,
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 0
            });
    });
}

async function reverseGeocode(lat, lon) {
    // Paste your locationIQ token below!
    const API_KEY = "pk.9155e1d21a93a0b1089cf5921919e6d0";

    const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`);

    if (!response.ok) {
        throw new Error("Reverse geocoding failed!");
    }

    return await response.json();
}

// ============================================================
// Fetch Suggestions from Search Input
// ============================================================

const searchInput = document.getElementById("search");
const resultsList = document.getElementById("search-results");

let selectedCoords = null;

async function fetchLocationSuggestions(query) {
    // Fetch location suggestions
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);

    // Convert to .JSON
    const data = await res.json();

    return data.results || [];
}

searchInput.addEventListener("input", async() => {
    // Get value from search
    const value = searchInput.value.trim();

    // Check value content length
    if (value.length < 2) {
        resultsList.style.display = "none";
        return;
    }

    const results = await fetchLocationSuggestions(value);
    resultsList.innerHTML = "";

    if (!results.length) {
        resultsList.style.display = "none";
        return;
    }

    // Append each search result to HTML element
    results.forEach((place) => {
        const li = document.createElement("li");

        const label = `${place.name}, ${place.country} ${place.admin ? " . " + place.admin1 : ""}`;

        li.textContent = label;

        li.addEventListener("click", () => {
            searchInput.value = place.name;

            selectedCoords = {
                latitude: place.latitude,
                longitude: place.longitude,
                locationName: place.name,
                country: place.country
            }

            resultsList.style.display = "none";
            fetchAPI();
        });
        resultsList.appendChild(li);
    });
    // Display search results if present
    resultsList.style.display = "block";
});

// ============================================================
// Toggle Dropdown Menu
// ============================================================

// Declare variables for menu toggle
const unitsToggle = document.getElementById("units");
const dayToggle = document.getElementById("day");

// Declare menu variables
const unitsMenu = document.getElementById("unitsMenu");
const dayMenu = document.getElementById("dayMenu");

unitsToggle.addEventListener("click", () => {
    console.log("Clicked!");

    // Toggle attribute style
    if (unitsMenu.style.display === "none") {
        unitsMenu.style.display = "flex";
    } else {
        unitsMenu.style.display = "none";
    }
});

dayToggle.addEventListener("click", () => {
    console.log("Clicked!");

    // Toggle attribute style
    if (dayMenu.style.display === "none") {
        dayMenu.style.display = "flex";
    } else {
        dayMenu.style.display = "none";
    }
});

// Hide these elements on 'window' click
document.addEventListener("click", event => {
    // Units menu
    if (!unitsMenu.contains(event.target) && event.target !== unitsToggle) {
        unitsMenu.style.display = "none";
    }

    // Day menu
    if (!dayMenu.contains(event.target) && event.target !== dayToggle) {
        dayMenu.style.display = "none";
    }

    // Dropdown selection
    if (!resultsList.contains(event.target)) {
        resultsList.style.display = "none";
    }
});

// ============================================================
// Toggle Units & Change Day
// ============================================================

document.querySelector(".switch-measurement").addEventListener("click", () => {
    // Change text content on each toggle
    const btnToggle = document.querySelector(".switch-measurement");
    btnToggle.classList.toggle("toggle");

    if (btnToggle.classList.contains("toggle")) {
        btnToggle.textContent = "Switch to metric";
    } else {
        btnToggle.textContent = "Switch to imperial";
    }

    // Toggle 'active' class for each measurement AND toggle 'hidden' attribute for each last child element
    const measurementHolder = document.querySelectorAll(".measurement-holder");
    const measurementInfo = document.querySelectorAll(".measurement-info");

    for (let i = 0; i < measurementHolder.length; i++) {
        measurementInfo.forEach((info) => {
            info.classList.toggle("active");
            info.lastElementChild.toggleAttribute("hidden");
        });
    }
});

// Add or remove 'active' class on click
const dayHolder = document.querySelectorAll(".day-holder");
const dayHolderArray = Array.from(dayHolder);

function onDayClick(index) {
    dayHolderArray.forEach((day, num) => {
        day.classList.remove("active");
        if (num === index) {
            day.classList.add("active");

            // Update HTML text content along with adding <img> element
            let dayDropdownMenu = document.getElementById("dropdownMenuDay");
            dayDropdownMenu.innerHTML = "";
            dayDropdownMenu.innerHTML +=
            `
                <p>${day.textContent}</p>
                <img src="assets/images/icon-dropdown.svg">
            `;

            // Append toggle button
            dayDropdownMenu.appendChild(dayToggle);
        }
    });
}

for (let i = 0; i < dayHolderArray.length; i++) {
    const day = dayHolderArray[i];

    day.addEventListener("click", () => {
        onDayClick(i);
    });
}

// ============================================================
// Light Mode Toggle
// ============================================================

// We can ACTUALLY put classes on BOTH 'html' and 'body'!! (so we can later manipulate their style properties)
const htmlDoc = document.querySelector(".html-doc");
const bodyDoc = document.querySelector(".body-doc");

function toggleLightMode() {
    // HTML toggle
    htmlDoc.classList.add("light-mode-html");

    // Search part toggle
    document.querySelector(".search-part").classList.add("light-mode-main-title");
    document.querySelector("#search").classList.add("light-mode-search");

    // Dropdown selection toggle
    resultsList.classList.toggle("light-mode-search-results");

    // Top part image toggle
    document.querySelector("#topPartImg").classList.add("light-mode-icon-title");

    // Info container toggle
    const infoContainer = document.querySelectorAll(".info-container");
    const infoContainerArray = Array.from(infoContainer);

    infoContainerArray.forEach((container) => {
        container.classList.add("light-mode-info-container");
    });

    // Info line color toggle
    const infoLine = document.querySelectorAll(".info-line");
    const infoLineArray = Array.from(infoLine);

    infoLineArray.forEach((line) => {
        line.classList.add("light-mode-info-line");
    });

    // Daily info toggle
    const dailyForecast = document.querySelector(".daily-forecast-part");
    dailyForecast.classList.toggle("light-mode-daily-forecast-part");

    const dailyInfo = document.querySelectorAll(".daily-info");
    const dailyInfoArray = Array.from(dailyInfo);

    dailyInfoArray.forEach((info) => {
        info.classList.add("light-mode-daily-info");
    });

    // Image background toggle
    const dailyInfoContent = document.querySelectorAll(".daily-info-content");
    const dailyInfoContentArray = Array.from(dailyInfoContent);

    dailyInfoContentArray.forEach((content) => {
        content.classList.add("light-mode-img");
    });

    // Right part toggle
    document.querySelector(".right-part").classList.add("light-mode-right-part");

    // Dropdown menu button toggle
    const allDropdowns = document.querySelectorAll(".dropdown-menu");
    const allDropdownsArray = Array.from(allDropdowns);

    allDropdownsArray.forEach((dropdown) => {
        dropdown.classList.add("light-mode-toggle-menu");
    });

    // Dropdown menu active toggle
    const allDropdownsMenu = document.querySelectorAll(".dropdown-menu-active");
    const allDropdownsMenuArray = Array.from(allDropdownsMenu);

    allDropdownsMenuArray.forEach((menu) => {
        menu.classList.add("light-mode-dropdown-menu");
    });

    // Switch measurement toggle
    document.querySelector(".switch-measurement").classList.add("light-mode-dropdown-button");

    // Measurement info toggle
    const allMeasurementInfo = document.querySelectorAll(".measurement-info");
    const allMeasurementInfoArray = Array.from(allMeasurementInfo);

    allMeasurementInfoArray.forEach((measurement) => {
        measurement.classList.add("light-mode-active");
    });

    // Day holder toggle
    const allDayHolder = document.querySelectorAll(".day-holder");
    const allDayHolderArray = Array.from(allDayHolder);

    allDayHolderArray.forEach((holder) => {
        holder.classList.add("light-mode-active");
    });

    // Hourly info toggle
    const hourlyInfo = document.querySelectorAll(".hourly-info");
    const hourlyInfoArray = Array.from(hourlyInfo);

    hourlyInfoArray.forEach((hour) => {
        hour.classList.add("light-mode-hourly-info");
    });

    // No internet connection toggle
    document.querySelector(".no-internet-connection").classList.add("light-mode-no-internet-connection");
}

// htmlDoc.style.backgroundColor = "#fff";  // (it works!!!!!)

// ============================================================
// Microphone
// ============================================================

const recognition = new window.webkitSpeechRecognition();
const micBtn = document.querySelector("#mic-input");
const micBtnImg = document.querySelector(".mic-icon-color");

function onStartVoice() {
    // Start the recognition
    recognition.start();

    // Toggle classes for style change
    micBtn.classList.toggle("active");
    micBtnImg.classList.toggle("active");
}

function onStopVoice() {
    // Stop the recognition
    recognition.stop();
}

recognition.onresult = function(event) {
    // Initialize variable
    let saidInput = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            saidInput = event.results[i][0].transcript;
        } else {
            saidInput += event.results[i][0].transcript;
        }
    }

    // Apply said value to input
    document.getElementById("search").value = saidInput;

    // Call the main function
    fetchAPI();
}

// Toggle classes for style change (after the input)
recognition.onend = function (event) {
    micBtn.classList.toggle("active");
    micBtnImg.classList.toggle("active");
}

micBtn.addEventListener("click", () => {
    onStartVoice();

    // setTimeout(onStopVoice(), 5000);
    setTimeout(() => {
        onStopVoice();
    }, 5000);
});

// ============================================================
// HTML elements
// ============================================================

// Main 'div' contents
const mainDiv = document.querySelector(".main-div");
const loadingMainDiv = document.querySelector(".loading-main-div");
const mainDivLeft = document.querySelector(".main-div-left");
const mainDivRight = document.querySelector(".main-div-right");

// Current image
const currentDayImg = document.querySelector("#currentImg");

// Info container contents
const infoLine = document.querySelectorAll(".info-line");
const infoTxt = document.querySelectorAll(".info-txt");

// Daily content
const dailyInfoContent = document.querySelectorAll(".daily-info-content");

// Hourly info
const hourlyInfo = document.querySelectorAll(".hourly-info");
let hourlyIcon = document.querySelectorAll(".hourly-icon");
let hourlyDegree = document.querySelectorAll(".hourly-degree");

// Dropdown menu button
let dropdownMenuBtn = document.getElementById("dropdownMenuDay");

// Retry button
const retryBtn = document.getElementById("retryBtn");

retryBtn.addEventListener("click", () => {
    window.location.reload();
});

// ============================================================
// Weather conditions lists
// ============================================================

// Weather conditions (use '.includes' if value is in array!)
const sunny = [0];
const partlyCloudy = [1, 2, 3];
const fog = [45, 48];
const drizzle = [51, 53, 55, 56, 57];
const rain = [61, 63, 65, 66, 67, 80, 81, 82];
const snow = [71, 73, 75, 77, 85, 86];
const storm = [95, 96, 99];

// Get weather code
function getWeatherIcon(code) {
    if (sunny.includes(code)) return "assets/images/icon-sunny.webp";
    if (partlyCloudy.includes(code)) return "assets/images/icon-partly-cloudy.webp";
    if (fog.includes(code)) return "assets/images/icon-fog.webp";
    if (drizzle.includes(code)) return "assets/images/icon-drizzle.webp";
    if (rain.includes(code)) return "assets/images/icon-rain.webp";
    if (snow.includes(code)) return "assets/images/icon-snow.webp";
    if (storm.includes(code)) return "assets/images/icon-storm.webp";
    return "assets/images/icon-partly-cloudy.webp"; // fallback
}

// ============================================================
// Hourly forecast functions
// ============================================================

function groupHoursByDay(hourlyTimeArray) {
    const days = {};

    hourlyTimeArray.forEach((time, index) => {
        const date = new Date(time);
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

        if (!days[weekday]) {
            days[weekday] = [];
        }

        // store position (hour index)
        days[weekday].push(index);
    });

    return days;
}

function displayHourlyForDay(dayName, hourlyData, dayGroups) {
    const hourlyItems = document.querySelectorAll(".hourly-info");
    if (!dayGroups[dayName]) return;

    // Use API time for correctness
    const apiNow = new Date(hourlyData.time.find(t => new Date(t) >= new Date()));
    const todayName = apiNow.toLocaleDateString("en-US", { weekday: "long" });
    const currentHour = apiNow.getHours();

    let collectedIndices = [];

    // Take hours from selected day
    const dayIndices = dayGroups[dayName];
    const startIndex = (dayName === todayName) ? currentHour : 0;

    for (let i = startIndex; i < dayIndices.length && collectedIndices.length < 8; i++) {
        collectedIndices.push(dayIndices[i]);
    }

    // If not enough, spill into next day
    if (collectedIndices.length < 8) {
        const weekdays = Object.keys(dayGroups);
        const currentDayPos = weekdays.indexOf(dayName);
        const nextDayName = weekdays[currentDayPos + 1];

        if (nextDayName && dayGroups[nextDayName]) {
        const nextDayIndices = dayGroups[nextDayName];

        for (let i = 0; i < nextDayIndices.length && collectedIndices.length < 8; i++) {
            collectedIndices.push(nextDayIndices[i]);
        }
        }
    }

    // Render UI
    collectedIndices.forEach((idx, i) => {
        if (!hourlyItems[i]) return;

        const dt = new Date(hourlyData.time[idx]);
        const h = dt.getHours();
        const ampm = h >= 12 ? "PM" : "AM";
        const displayH = h % 12 === 0 ? 12 : h % 12;

        hourlyItems[i].querySelector(".hourly-text").textContent = `${displayH} ${ampm}`;
        hourlyItems[i].querySelector(".hourly-icon").src = getWeatherIcon(hourlyData.weather_code[idx]);
        hourlyItems[i].querySelector(".hourly-degree").textContent =
        `${Math.round(hourlyData.temperature_2m[idx])}°`;
    });

    // Set image for current day
    currentDayImg.src = getWeatherIcon(hourlyData.weather_code[0]);

    // Call this function to apply statring animation
    callOnce();

    // Start default animation for daily info images
    dailyDefaultAnimation();
}

// ============================================================
// Call this function only ONCE 
// ============================================================

let hasBeenCalled = false;

function createOnceFunction() {
    return function() {
        if (!hasBeenCalled) {
            console.log("ONCE function called!");
            firstAnimation();
            hasBeenCalled = true;
        } else {
            console.log("This function cannot be called anymore.");
            removeAnimation();
        }
    }
}

const callOnce = createOnceFunction();

// ============================================================
// Fetch API
// ============================================================

async function fetchAPI() {
    // Declare search value variable
    let searchParam = document.getElementById("search").value.trim();

    // Declare latitude and longitude variable (for later use on another fetch)
    let latitude = null;
    let longitude = null;

    // Declare first location's name
    let firstLocation = null;
    let firstCountry = null;

    // Declare location variable
    let locationString = null;

    // Decalre country variable
    let countryString = null;

    if (searchParam === "") {
        const position = await getCurrentPositionAsync();

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        const geoData = await reverseGeocode(latitude, longitude);
        const locationName = geoData.address;

        const address = 
        locationName.city ||
        locationName.town ||
        locationName.village ||
        locationName.hamlet ||
        locationName.county ||
        locationName.state ||
        "Unknown location";

        // Append starting values on load
        firstLocation = address;
        firstCountry = locationName.country;

        // Console log for debugging purposes
        console.log(`Current location: ${firstLocation}\nCurrent country: ${firstCountry}`);
    }

    // Get 'latitude' and 'longitude' values
    try {
        const location = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchParam}`);

        // https://geocoding-api.open-meteo.com/v1/search?name=${searchParam}

        // Edit HTML during loading process
        mainDiv.style.backgroundImage = "none";
        loadingMainDiv.style.display = "flex";
        mainDivLeft.style.display = "none";
        mainDivRight.style.display = "none";

        /* main-div */
        mainDiv.classList.remove("ease-in");

        /* info-line */
        infoLine.forEach((line) => {
            line.style.display = "flex";
        });

        /* info-txt */
        infoTxt.forEach((text) => {
            text.style.display = "none";
        });

        /* daily-info-content */
        dailyInfoContent.forEach((content) => {
            content.style.display = "none";
        });

        /* hourly-info */
        hourlyInfo.forEach((hour) => {
            hour.style.display = "none";
        });

        /* dropdownMenuDay button */
        dropdownMenuBtn.innerHTML = "";

        if (!location.ok) {
            // Edit HTML accordingly
            document.querySelector(".search-part").style.display = "none";
            document.querySelector(".main-part").style.display = "none";
            document.querySelector(".no-internet-connection").style.display = "flex";

            throw new Error(`HTTP error! status: ${location.status}`);
        }

        // Convert to .JSON()
        const info = await location.json();

        // Important check!
        if (searchParam === "") {
            locationString = firstLocation;
            countryString = firstCountry;
        } else {
            locationString = info.results[0].name;
            countryString = info.results[0].country;
        }

        // Console log to obtain info
        console.log(info);
        console.log("Geographic info", info.results[0].latitude, info.results[0].longitude);

        // Save these values to variables
        latitude = info.results[0].latitude;
        longitude = info.results[0].longitude;
    } catch(error) {
        console.log(error);
    }

    // From given latitude and longitude values, get weather values from that location
    try {
        // Toggle measurement button
        const switchMeasurementBtn = document.querySelector(".switch-measurement");

        // Response variable used to fetch
        let response;

        // Create an 'if' statement to check wheter to use metric or imperial measurement
        if (!switchMeasurementBtn.classList.contains("toggle")) {
            response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`);
        } else {
            response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=7`);
        }

        /* Add this to fetch imperial units */
        // temperature:     &temperature_unit=fahrenheit
        // wind speed:      &wind_speed_unit=mph
        // precipitation:   &precipitation_unit=inch

        if (!response.ok) {
            // Edit HTML accordingly
            document.querySelector(".search-part").style.display = "none";
            document.querySelector(".main-part").style.display = "none";
            document.querySelector(".no-internet-connection").style.display = "flex";

            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Convert to .JSON()
        const data = await response.json();

        // Edit HTML during loading process
        mainDiv.style.backgroundImage = "url(assets/images/bg-today-large.svg)";
        loadingMainDiv.style.display = "none";
        mainDivLeft.style.display = "flex";
        mainDivRight.style.display = "flex";

        /* main-div */
        mainDiv.classList.add("ease-in");

        // Save current date to variable
        let date = new Date(data.current.time);

        // Call 'hourly' functions
        const dayGroups = groupHoursByDay(data.hourly.time);

        // Display today on load
        const todayName = new Date(data.current.time).toLocaleDateString("en-US", { weekday: "long" });
        displayHourlyForDay(todayName, data.hourly, dayGroups);

        // Clicking a day should update the hourly boxes
        dayHolderArray.forEach((el) => {
            el.addEventListener("click", () => {
                const selectedDay = el.textContent.trim();
                displayHourlyForDay(selectedDay, data.hourly, dayGroups);
            }); 
        });

        // Extract specified values from 'date'
        let hour = date.getHours();
        let day = date.getDay();
        let month = date.getMonth();
        let dateNum = date.getDate();
        let year = date.getFullYear();

        // String value from 'day'
        let dayString;

        if (day === 1) {
            dayString = "Monday";
        } else if (day === 2) {
            dayString = "Tuesday";
        } else if (day === 3) {
            dayString = "Wednesday";
        } else if (day === 4) {
            dayString = "Thursday";
        } else if (day === 5) {
            dayString = "Friday";
        } else if (day === 6) {
            dayString = "Saturday";
        } else {
            dayString = "Sunday";
        }

        /* info-line */
        infoLine.forEach((line) => {
            line.style.display = "none";
        });

        /* info-txt */
        infoTxt.forEach((text) => {
            text.style.display = "flex";
        });

        /* daily-info-content */
        dailyInfoContent.forEach((content) => {
            content.style.display = "flex";
        });

        /* hourly-info */
        hourlyInfo.forEach((hour) => {
            hour.style.display = "flex";
        });

        /* dropdownMenuDay button */
        dropdownMenuBtn.innerHTML +=
        `
            <p>${dayString}</p>
            <img src="assets/images/icon-dropdown.svg">
        `;

        dropdownMenuBtn.appendChild(dayToggle);

        // String value from 'month'
        const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let monthString = monthArray[month];

        console.log(date.toLocaleTimeString());
        console.log(`Current location: ${locationString}\nCurrent country: ${countryString}\nCurrent hour: ${hour}\nCurrent day: ${dayString}\nCurrent month: ${monthString}\nCurrent date: ${dateNum}`);

        // Current temperature
        let currentTemp = Math.round(data.current.temperature_2m);

        // Forecast info
        let feelsLikeTemp = Math.round(data.hourly.apparent_temperature[hour]);
        let humidity = Math.round(data.hourly.relative_humidity_2m[hour]);
        let windSpeed = Math.round(data.current.wind_speed_10m);
        let precipitation = Math.round(data.hourly.precipitation[hour]);

        /* ================================================= */

        // Get elements from HTML
        let locationVal = document.querySelector(".location");
        let countryVal = document.querySelector(".country");
        let dayVal = document.querySelector(".day");
        let monthlyVal = document.querySelector(".month");
        let dateVal = document.querySelector(".date");
        let yearVal = document.querySelector(".year");

        // Apply values accordingly
        locationVal.textContent = locationString;
        countryVal.textContent = countryString;
        dayVal.textContent = dayString;
        monthlyVal.textContent = monthString;
        dateVal.textContent = dateNum;
        yearVal.textContent = year;

        /* ================================================= */

        // Get elements from HTML
        let degrees = document.querySelector(".degrees");
        let degreesFL = document.getElementById("fl-degrees");
        let humidityVal = document.getElementById("humidity");
        let speedVal = document.getElementById("wind-speed");
        let precipitationVal = document.getElementById("precipitation");

        // Apply values accordingly
        degrees.textContent = `${currentTemp}°`;
        degreesFL.textContent = `${feelsLikeTemp}°`;
        humidityVal.textContent = `${humidity}%`;

        /* metrics/imperial */
        if (!switchMeasurementBtn.classList.contains("toggle")) {
            speedVal.textContent = `${windSpeed} km/h`;
            precipitationVal.textContent = `${precipitation} mm`;
        } else {
            speedVal.textContent = `${windSpeed} mp/h`;
            precipitationVal.textContent = `${precipitation} in`;
        }

        // Console log for debugging purposes
        console.log(data);

        console.log(`Current temperature: ${currentTemp}\nFeels like: ${feelsLikeTemp}\nHumidity: ${humidity}\nWind speed: ${windSpeed}\nPrecipitation: ${precipitation}`);

        // Daily info content
        const dailyInfoContentArray = Array.from(dailyInfoContent);
        let maxTempVal = document.querySelectorAll(".max-deg");
        let minTempVal = document.querySelectorAll(".min-deg");
        let weatherIcon = document.querySelectorAll(".weather-icon");

        let dailyMax = data.daily.temperature_2m_max;
        let dailyMin = data.daily.temperature_2m_min;
        let dailyTime = data.daily.time;
        let dailyCode = data.daily.weather_code;

        for (let i = 0; i < dailyInfoContentArray.length; i++) {
            // All days in a week
            const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            // Start from current day
            let day = week[new Date(dailyTime[i]).getDay()];
            dailyInfoContentArray[i].firstElementChild.textContent = day;

            // Temperatures
            maxTempVal[i].textContent = `${Math.round(dailyMax[i])}°`;
            minTempVal[i].textContent = `${Math.round(dailyMin[i])}°`;

            // Icons
            if (sunny.includes(dailyCode[i])) {
                weatherIcon[i].src = "assets/images/icon-sunny.webp";
            } else if (partlyCloudy.includes(dailyCode[i])) {
                weatherIcon[i].src = "assets/images/icon-partly-cloudy.webp";
            } else if (fog.includes(dailyCode[i])) {
                weatherIcon[i].src = "assets/images/icon-fog.webp";
            } else if (drizzle.includes(dailyCode[i])) {
                weatherIcon[i].src = "assets/images/icon-drizzle.webp";
            } else if (rain.includes(dailyCode[i])){
                weatherIcon[i].src = "assets/images/icon-rain.webp";
            } else if (snow.includes(dailyCode[i])) {
                weatherIcon[i].src = "assets/images/icon-snow.webp";
            } else if (storm.includes(dailyCode[i])) {
                weatherIcon[i].src = "assets/images/icon-storm.webp";
            }
        }

        // Hourly forecast (set 'active' class for current day)
        dayHolder.forEach((holder) => {
            holder.classList.remove("active");
            if (holder.textContent === dayString) {
                holder.classList.add("active");
            }
        });
    } catch(error) {
        console.error(error);
    }
}

function dailyDefaultAnimation() {
    const dailyInfoImg = document.querySelectorAll(".weather-icon");

    dailyInfoImg.forEach((daily) => {
        daily.classList.add("pulse");
    });
}

function firstAnimation() {
    // Add starting animation for 'current' image
    currentDayImg.classList.add("first-showup");

    // Set timeout for default animations
    setTimeout(removeAnimation, 1600);
}

function removeAnimation() {
    // Remove every default animation
    currentDayImg.classList.remove("pulse");
    currentDayImg.classList.remove("spin");

    // Check if image source contains "sunny"
    if (currentDayImg.src.includes("sunny")) {
        currentDayImg.classList.add("spin");
    } else {
        currentDayImg.classList.add("pulse");
    }
}

// Search for a location on first load
window.addEventListener("DOMContentLoaded", () => {
    // Start fetching the data
    fetchAPI();

    // Check for current hour (toggle light mode)
    let currentHour = new Date().getHours();
    console.log("Current hour:", currentHour);

    if (currentHour < 18 && currentHour > 6) {
        toggleLightMode();
    }
});

document.getElementById("searchBtn").addEventListener("click", () => fetchAPI());
