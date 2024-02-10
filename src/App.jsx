import { useEffect, useState } from 'react'


 import clear1 from "./assets/clear1.png";
 
 import drizzle from "./assets/drizzle.png";
 import rain from "./assets/rain.png";
 import snow from "./assets/snow.png";
 import search1 from "./assets/search.png";
import wind from "./assets/wind.png";
import humidity from "./assets/humidity.png";
import './App.css';

const WeatherDetails = ({icon,temp,city,country,lat,lon,humi,windy}) => {
  return(
    <>
    <div className='image'>
      <img src={icon} alt="Image" height="200px" />
    </div>
    <div className='temp'>{temp} °C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className='cord'> 
    <div>
    <span className="lat">lattitude</span>
    <span>{lat}</span>
    </div>
    <div>
    <span className="lon">longitude</span>
    <span>{lon}</span>
    </div>
    </div>
    <div className='data-container'>
      <div className='element'>
        <img src={humidity} alt="humidity"  className='icon' height="55px"/>
        <div className='data'>
          <div className='humidity-percent'>{humi}%</div>
          <div className='text'>Humidity</div>

        </div>

      </div>
      <div className='element'>
        <img src={wind} alt="wind"  className='icon'  height="55px"/>
        <div className='data'>
          <div className='wind-percent'>{windy} km/h</div>
          <div className='text'>Wind Speed</div>

        </div>

      </div>
    </div>
    
    </>
    

  );
};


function App() {
  let api_key = "c8e3f7ae0fde1c6b37d93c8a562d67a1";
const [text, setText] = useState("Chennai")

  const [icon, setIcon] = useState(snow);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clear1,
    "01n": clear1,
    "02d": clear1,
    "02n": clear1 ,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,

  };
  
  const search = async () => {
    setLoading(true);
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&lat={lat}&lon={lon}&appid=${api_key}&units=Metric`;
    try{
      let res = await fetch(url);
      let data = await res.json();
      //console.log(data);
      if(data.cod === "404"){
        console.error('Unable to find city');
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clear1);
      setCityNotFound(false);
    }catch(error)
    {
      console.log("An error occurred:", error.message);
      setError("An error occurred while fetching wheater data...");

    }finally{
    setLoading(false);
    }
  };

  const handleCity = (e) => {
setText(e.target.value);
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter"){
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search-City' onChange={handleCity} value={text}
          onKeyDown={handleKeyDown} />
          <div className='search-icon' onClick={() => search()}> 
            <img src={search1} alt="Search" height="25px" width = "25px"/>
          </div>
        </div>
        
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}

        {!cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city}  
        country={country}  lat={lat} lon={lon} humi={humidity} windy={wind} />}
      </div>
        
    </>
  );
}

export default App;
