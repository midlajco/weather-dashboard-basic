const API_KEY = "b85bfbc5cab07beac40b20d106413951";

const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const favoritesDiv = document.getElementById("favorites");
const theme =document.getElementById("themeBtn")



let timer;
// Debounce
cityInput.addEventListener("keyup",()=>{

    clearTimeout(timer);

    timer=setTimeout(()=>{

        if(cityInput.value.trim()!=""){
            searchWeather(cityInput.value);
        }

    },2000);

});

// Search Button
document.getElementById("searchBtn").addEventListener("click",()=>{

    if(cityInput.value.trim()!=""){
        searchWeather(cityInput.value);
    }

});

     //then searchwether invokes

// Search Weather
async function searchWeather(city){

    loading.textContent="Loading...";
    error.textContent="";
    weatherCard.style.display="none";

    try{

        const weather=await getWeather(city);

        loading.textContent="";

        weatherCard.style.display="flex";

        weatherCard.innerHTML=`
            <h2>${weather.city}</h2>
            <p>Temperature : ${weather.temp}°C</p>
            <p>Feels Like : ${weather.feelsLike}°C</p>
            <p>Weather : ${weather.description}</p>
            <p>Humidity : ${weather.humidity}%</p>
            <p>Wind : ${weather.wind} m/s</p>

            <button onclick="addFavorite('${weather.city}')">
                Add to Favorites
            </button>
        `;

    }
    catch(err){

        loading.textContent="";
        error.textContent=err.message;

    }

}   
       //inside searchwether it calls getwether   and get wether -weatherc






// Fetch Weather
async function getWeather(city){

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("City not found");
    }

    const data = await response.json();

    return{
        city:data.name,
        temp:Math.round(data.main.temp),
        feelsLike:Math.round(data.main.feels_like),
        humidity:data.main.humidity,
        description:data.weather[0].description,
        wind:data.wind.speed
    };
}



// Add Favorite
function addFavorite(city){

    let favorites=JSON.parse(localStorage.getItem("favorites")) || [];

    if(!favorites.includes(city)){
        favorites.push(city);
        localStorage.setItem("favorites",JSON.stringify(favorites));
    }

    loadFavorites();

}

// Load Favorites
function loadFavorites(){

    let favorites=JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesDiv.innerHTML="";

    favorites.forEach(city=>{

        favoritesDiv.innerHTML+=`
            <div class="favorite">
                <span onclick="searchWeather('${city}')">${city}</span>

                <button onclick="removeFavorite('${city}')">
                    X
                </button>
            </div>
        `;

    });

}

// Remove Favorite
function removeFavorite(city){

    let favorites=JSON.parse(localStorage.getItem("favorites")) || [];

    favorites=favorites.filter(item=>item!==city);

    localStorage.setItem("favorites",JSON.stringify(favorites));

    loadFavorites();

}



// Theme Toggle
theme.addEventListener("click",()=>{

    document.body.classList.toggle("dark");
    theme.textContent="Dark"

});

// Load Favorites
loadFavorites();