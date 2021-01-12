// Options
const SEARCH_URL = "https://google.com/search?q=";
const OPEN_WEATHER_API_KEY = "6c3c85a6090263fa57f33509d647f7ff";

// Search on enter key event
function search(e) {
  if (e.keyCode == 13) {
    var val = document.getElementById("search-field").value;
    window.location.href = SEARCH_URL + val;
  }
}

// Get current time and format
function getTime() {
  let date = new Date(),
    min = date.getMinutes(),
    sec = date.getSeconds(),
    hour = date.getHours();

  return (
    "" +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (min < 10 ? "0" + min : min) +
    ":" +
    (sec < 10 ? "0" + sec : sec)
  );
}

// Handle Weather request
function getWeather() {
  let xhr = new XMLHttpRequest();

  // Request to open weather map
  xhr.open(
    "GET",
    "http://api.openweathermap.org/data/2.5/weather?id=4930956&mode=html&units=imperial&appid=" + OPEN_WEATHER_API_KEY
  );

  xhr.onload = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);

        // Create a dummy DOM to parse and strip the returned HTML
        let dom = document.createElement("html");
        dom.innerHTML = xhr.responseText;

        // Pull out only the body tag
        content = dom.querySelector("body");

        // Remove the link to Open Weather
        content.querySelector("div > a").parentElement.remove();

        // Remove all script tags (contains Google Ad tracking)
        Array.from(content.getElementsByTagName("script")).forEach(tag => tag.remove());

        // Remove default styles and update classes
        let rootDivs = Array.from(content.querySelectorAll("body > div"));
        rootDivs.forEach(tag => tag.removeAttribute("style"));

        let weatherTitle = rootDivs[0];
        weatherTitle.className = "weather-city";

        let weatherInfo = rootDivs[1];
        weatherInfo.className = "weather-info";

        weatherInfo.children[0].removeAttribute("style");
        weatherInfo.children[0].children[1].children[1].remove();

        let extraDivs = content.querySelectorAll(".weather-info > div:nth-child(1) div");
        Array.from(extraDivs).forEach(tag => {
          tag.style.removeProperty("padding");
          tag.style.removeProperty("clear");
          tag.style.removeProperty("float");

          tag.style.display = "inline-block";
          tag.style.verticalAlign = "middle";
        });

        Array.from(weatherInfo.children).forEach(tag => {
          if (tag.style.fontSize === "small") {
            tag.style.fontSize = "medium";
            tag.style.color = "var(--fg)";
          }
          else if (tag.style.fontSize === "x-small") {
            tag.style.fontSize = "small";
            tag.style.color = "var(--secondaryFg)";
          }
        });

        Array.from(content.querySelectorAll('.weather-info div')).forEach(tag => {
          if (tag.style.length === 0) {
            tag.removeAttribute("style");
          }
        });

        // Update the Weather Container with the clean HTML
        document.querySelector(".weather-container").innerHTML = content.innerHTML;
      } else {
        console.log("error msg: " + xhr.status);
        document.querySelector(".weather-container").innerHTML = "unable to retrieve weather data";
      }
    }
  };

  xhr.send();
}

// Handle writing out Bookmarks
function setupBookmarks() {
  const bookmarkContainer = document.getElementById("bookmark-container");

  bookmarkContainer.innerHTML = bookmarks
    .map((b) => {
      const html = ["<div class='bookmark-set'>"];
      html.push(`<div class="bookmark-title">${b.title}</div>`);
      html.push("<div class='bookmark-inner-container'>");
      html.push(
        ...b.links.map(
          (l) =>
            `<a class="bookmark" href="${l.url}">${l.name}</a>`
        )
      );
      html.push("</div></div>");
      return html.join("");
    })
    .join("");
}

window.onload = () => {
  // Set up bookmarks and weather
  setupBookmarks();
  getWeather();

  // Set up the clock and interval to tick clock
  document.getElementById("clock").innerHTML = getTime();
  setInterval(() => {
    document.getElementById("clock").innerHTML = getTime();
  }, 100);
};

document.addEventListener("keyup", (event) => {
  if (event.keyCode == 32) {
    // Spacebar code to open search
    document.getElementById("search").style.display = "flex";
    document.getElementById("search-field").focus();
  } else if (event.keyCode == 27) {
    // Esc to close search
    document.getElementById("search-field").value = "";
    document.getElementById("search-field").blur();
    document.getElementById("search").style.display = "none";
  }
});
