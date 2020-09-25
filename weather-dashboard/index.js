const cityText = document.getElementById("city");
const tempCurrentText = document.getElementById("temp-current");
const tempMinText = document.getElementById("temp-min");
const tempMaxText = document.getElementById("temp-max");
const tempHumidityText = document.getElementById("temp-humidity");
const icon = document.getElementById("icon");
const messageText = document.getElementById("temp-msg");
const clockText = document.getElementById("clock");
const jokeSetup = document.getElementById("joke-setup");
const jokePunchline = document.getElementById("joke-punchline");
const cards = document.getElementsByClassName("card");

const pageLoader = document.getElementById("page-loader");

console.log(pageLoader);

console.log(cards);

const icons = {
  clear: "./assets/icons/weather-icons/clear.svg",
  cloudClear: "./assets/icons/weather-icons/cloud.svg",
  cloudOther: "./assets/icons/weather-icons/cloud-other.svg",
  mist: "./assets/icons/weather-icons/mist.svg",
  rainShower: "./assets/icons/weather-icons/rain-shower.svg",
  rain: "./assets/icons/weather-icons/rain.svg",
  snow: "./assets/icons/weather-icons/snow.svg",
  thunder: "./assets/weather-icons/icons/thunder.svg",
};

// Hello Hacker-Man - You shouldn't be here (p.s. The API Keys are are worthless 😉)

// Get City From API
// async function getCity() {
//   const city = await fetch(
//     "http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1"
//   )
//     .then(async (result) => {
//       let data = await result.json();
//       return data.data[0].city;
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   return city;
// }

async function getCity() {
  const city = await fetch(`http://ipinfo.io?token=${credentials.ipinfoAPIKEY}`)
    .then(async (result) => {
      let data = await result.json();
      return data.city;
    })
    .catch((err) => {
      console.log(err);
    });

  return city;
}

// Get Weather From API
async function getWeather(city) {
  let searchParam = city.replace(/\s/g, "%20");
  let data = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?appid=${credentials.openWeatherMapAPIKEY}&units=metric&q=${searchParam}`
  )
    .then(async (result) => {
      return result.json();
    })
    .catch((err) => {
      console.log(err);
    });

  function parseIconCode(x) {
    let icon = "";
    switch (true) {
      case x < 300:
        icon = icons.thunder;
        break;
      case x < 400:
        icon = icons.rainShower;
        break;
      case x < 600:
        icon = icons.rain;
        break;
      case x < 700:
        icon = icons.snow;
        break;
      case x < 800:
        icon = icons.mist;
        break;
      case x === 800:
        icon = icons.clear;
        break;
      case x === 801:
        icon = icons.cloudClear;
        break;
      case x < 900:
        icon = icons.cloudOther;
        break;
      default:
        console.log("Parse Icon Code Encountered Error");
    }

    return icon;
  }

  data = {
    tempCurrent: Number(data.main.temp).toFixed(1),
    tempMax: data.main.temp_max,
    tempMin: data.main.temp_min,
    humidity: data.main.humidity,
    iconSrc: parseIconCode(Number(data.weather[0].id)),
    weatherMessage: data.weather[0].description
      .split(" ")
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(" "),
  };
  return data;
}

async function getJoke() {
  let joke = await fetch(
    "https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous,Pun?blacklistFlags=nsfw,religious,political,racist,sexist"
  )
    .then(async (result) => {
      return await result.json();
    })
    .catch((err) => {
      console.log(err);
    });

  if (joke.type == "single") {
    jokeSetup.innerHTML = joke.joke;
    jokePunchline.hidden = true;
  } else {
    jokeSetup.innerHTML = joke.setup;
    jokePunchline.innerHTML = joke.delivery;
  }
}

// Update Website With Info
const populateWebsite = async () => {
  let city = await getCity();
  let {
    tempCurrent,
    tempMax,
    tempMin,
    humidity,
    weatherMessage,
    iconSrc,
  } = await getWeather(city);

  cityText.textContent = city;
  tempCurrentText.textContent = tempCurrent;
  tempMinText.textContent = tempMin;
  tempMaxText.textContent = tempMax;
  tempHumidityText.textContent = humidity;
  messageText.textContent = weatherMessage;
  icon.src = iconSrc;

  for (let card of cards) {
    card.style.visibility = "visible";
  }

  setTimeout(() => {
    pageLoader.style.visibility = "hidden";
  }, 750);
};

// Clock Function
function updateClock() {
  const updateTime = () => {
    let d = new Date();
    var time = {
      hours: "",
      mins: d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes(),
      secs: d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds(),
      sign: d.getHours() < 13 ? "am" : "pm",
    };

    let hours = d.getHours();
    if (hours === 0) {
      time.hours = 12;
    } else if (hours < 10) {
      time.hours = "0" + hours;
    } else {
      time.hours = hours;
    }

    clockText.textContent = `${time.hours}:${time.mins}:${time.secs} ${time.sign}`;
  };

  updateTime();
  setInterval(() => {
    updateTime();
  }, 500);
}

updateClock();
getJoke();
populateWebsite();
