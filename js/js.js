'use strict';

let myLat = 0, myLng = 0;
const search = document.getElementsByClassName("search")[0];
const searchBox = document.getElementsByClassName("searchBox")[0];

search.addEventListener("click", function(){
    searchBox.classList.add("active");
    document.getElementById("search").focus();
});

document.getElementById("search").addEventListener("blur", function(){
    searchBox.classList.remove("active");
});

// 위치값 받아오기
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        getWeather(myLat, myLng, "");
    });
}

function getWeather(lat, lon, city){
    const url = "https://api.openweathermap.org/data/2.5/forecast";
    const apikey = "f3d27bb5def575995ef57a82c7245b79";
    let mydata;
    if(city == ""){
        mydata = {
            lat: lat,
            lon: lon,
            appid: apikey,
            units: 'metric',
            lang: 'kr'
        }
    }else{
        mydata = {
            q: city,
            appid: apikey,
            units: 'metric',
            lang: 'kr'
        }
    }

    let params = Object.keys(mydata).map(key => key + "=" + mydata[key]).join("&");
    console.log(params);

    fetch(`${url}?${params}`)
    .then( reson => reson.json())
    .then( rs => {
        console.log(rs);
        /*
        화면에 뿌려야할 데이터들
        => 1.도시명 2.시간 3.아이콘 4.현재온도 5.최저온도, 최고온도 6.설명 7.해뜨는 시각 8.해지는 시각 9.바람 10.습도 11.구름 12.체감온도
        */
        console.log("도시명", rs.city.name);
        let nowTime = new Date(rs.list[0].dt*1000); // 유닉스타임을 시간으로 변환
        console.log(nowTime);
        console.log("아이콘", rs.list[0].weather[0].icon);
        console.log("현재온도", rs.list[0].main.temp);
        console.log("최저온도", rs.list[0].main.temp_min, "최고온도" ,rs.list[0].main.temp_max);
        console.log("설명", rs.list[0].weather[0].description);
        let sunrTime = new Date(rs.city.sunrise*1000);
        console.log(sunrTime);
        let sunsTime = new Date(rs.city.sunset*1000);
        console.log(sunsTime);
        console.log("풍속", rs.list[0].wind.speed);
        console.log("습도", rs.list[0].main.humidity + "%");
        console.log("구름", rs.list[0].clouds.all);
        console.log("체감온도", rs.list[0].main.feels_like);

        let place = `${rs.city.name}`;
        document.getElementById('place').innerHTML = place;
          
        let ntime = `${nowTime.getFullYear()}년 ${nowTime.getMonth()}월 ${nowTime.getDate()}일 ${nowTime.getHours()}시`;
        document.getElementById('ntime').innerHTML = ntime;
        let sunrise = `${sunrTime.getHours()}:${sunrTime.getMinutes()}`;
        document.getElementById('sunrise').innerHTML = sunrise;
        let sunset = `${sunsTime.getHours()}:${sunsTime.getMinutes()}`;
        document.getElementById('sunset').innerHTML = sunset;
        document.getElementById('wind').innerHTML = rs.list[0].wind.speed + 'm/s';
        document.getElementById('humidity').innerHTML = rs.list[0].main.humidity + "%";
        document.getElementById('cloud').innerHTML = rs.list[0].clouds.all + "%";
        document.getElementById('feellike').innerHTML = rs.list[0].main.feels_like + "&deg;";


        let html = "";
        for(let i in rs.list){
            let dayTime = new Date(rs.list[i].dt*1000);
            let dayHours = (dayTime.getHours()>12) ? `PM ${dayTime.getHours()-12}`:`AM ${dayTime.getHours()}`;
            let dayDate = dayTime.getDate() + "일 " + dayHours + "시";
            let dat_minmax = rs.list[i].main.temp_min.toFixed(1) + "&deg; /" + rs.list[i].main.temp_max.toFixed(1) + "&deg;";
            html += `<li>
                         <div class="dayWeather">
                             <p class="daydate">${dayDate}</p>
                             <img src="images/${rs.list[i].weather[0].icon}.svg" alt="01d">
                             <p id="daytemp">${dat_minmax}</p>
                             <p class="daydesc">${rs.list[i].weather[0].description}</p>
                         </div>
                     </li>`;
        }
        console.log(html);
        document.getElementById('wholeweather').innerHTML = html;
    });
}