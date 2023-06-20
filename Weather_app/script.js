const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "f203ed06a3418a10f3997d8f4c3981f3";
oldTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(newTab)
{
    if(newTab != oldTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab = newTab ;
        oldTab.classList.add("current-tab"); 
        
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // Ab bilkul ulta karna hai , that means search wale pe tha to ab your wale pe aagaya
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");  
            // Now I am in your weather tab
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click" , () =>
{
    
    // Pass clicked tab as input container
    switchTab(userTab);
});

searchTab.addEventListener("click" , () =>
{
    // Pass clicked tab as input container
    switchTab(searchTab);
});

function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        // If hume local coordinates nani mile to
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates)
{
    const {lat , long} = coordinates;
    
    // Grantacesscontainer ko remove krdo
    grantAcessContainer.classList.remove("active");
    
    // Loading screen ko visible krado
    loadingScreen.classList.add("active");
    
    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){ 
        loadingScreen.classList.remove("active")
        // H.W.
    }
}

function renderWeatherInfo(weatherInfo){
    // sabse pehle saare elements ko fetch krdo
    
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    // Fetch values from WeatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${ weatherInfo?.clouds?.all}%`;
}

function getlocation()
{
    if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(showPostion);
    else
    alert("No Geolocation availible");
}

function showPostion(postion)
{
    const usercoordinates = {
        lat : postion.coords.latitude ,
        long : postion.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates" , JSON.stringify(usercoordinates));
    fetchWeatherInfo(usercoordinates);
}

const grantAcessBtn = document.querySelector("[data-grantAcess]");
grantAcessBtn.addEventListener("click" , getlocation);

const searchInput  = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" ,(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    
    if(cityName === "") 
    return;
    else 
    fetchSearchhWeatherInfo(cityName);
})

async function fetchSearchhWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");
    
    try{
        const response = await fetch(`https://api.openweathermap.org./data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
            
    }
}