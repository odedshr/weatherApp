const key = 'f20a73d3467ff08b53d3ad37ef781115',
    cityName = 'Edinburgh';

function WeatherApp(dataProvider){
    dataProvider.getData().then(this.renderPage.bind(this));
}

WeatherApp.prototype = {
    renderPage(data) {
        //remove loading message
        document.body.removeChild(document.querySelector('.loading'));

        if (data.cod === '200')  {
            //Data is a long list of sample (3hrs apart); we'll first group 
            //them into days and get some daily statictics
            this.forcastByDay = this.getForecastGroupByDay(data.list);

            //add background
            document.body.classList.add('weather-' + data.list[0].weather[0].main.toLowerCase());
            //set Page Header
            document.body.appendChild(this.getCityInfoElement(data.city, this.forcastByDay.size - 1)); // -1 excludes today
            //display data, default selected index is temperature
            document.body.appendChild(this.getWeatherInfoElement(this.forcastByDay, 'temperature'));
        } else {
            document.body.appendChild(this.getErrorElement(data));
        }
    },

    getTemplate (templateName) {
        return document.importNode(document.getElementById(templateName).content, true);
    },

    getCityInfoElement (city, numberOfDays) {
        let clone = this.getTemplate('template-cityData');
        clone.querySelector('.numberOfDays').innerHTML = numberOfDays;
        clone.querySelector('.cityName').innerHTML = city.name;
        clone.querySelector('.countryName').innerHTML = city.country;
        
        return clone;
    },

    getWeatherInfoElement (forcastByDay, index) {
        let clone = this.getTemplate('template-weatherList'),
            listDomElement = clone.querySelector('.days');

        Array.from(forcastByDay).forEach((day, dayNumber) => {
            if (dayNumber === 0) {
                // Add today's information
                clone.prepend(this.getTodaysWeatherElement (day[1], index));
            } else {
                // Add upcoming 5 days forecast
                listDomElement.appendChild(this.getDailyWeatherElement(day[1], index));
            }
        });

        return clone;
    },

    getTodaysWeatherElement (today, index) {
        let clone = this.getTemplate('template-today');
        clone.querySelector('.temperature .value').innerHTML = this.getValue(today, 'temperature');
        clone.querySelector('.humidity .value').innerHTML = this.getValue(today, 'humidity');
        clone.querySelector('.pressure .value').innerHTML = this.getValue(today, 'pressure');
        clone.querySelector('.clouds .value').innerHTML = this.getValue(today, 'clouds');
        clone.querySelector('.wind .value').innerHTML = this.getValue(today, 'wind');
        clone.querySelector('.rain .value').innerHTML = this.getValue(today, 'rain');
        clone.querySelector('.snow .value').innerHTML = this.getValue(today, 'snow');
        clone.querySelector('.' + index).classList.add('selected');

        // make all index elements clickable. when clicked, they'll change the value
        clone.querySelectorAll('.index').forEach(element => {
            let index = element.classList[1]; // item 0 in classList is 'index'
            element.onclick = evt => { this.updateIndex(index); };
        });
        return clone;
    },

    getDailyWeatherElement(day, index) {
        let clone = this.getTemplate('template-weatherDay');

        clone.querySelector('.weatherIcon').src = 'http://openweathermap.org/img/w/' + day.forecasts[0].weather[0].icon + '.png';
        clone.querySelector('.index').classList.add(index);
        clone.querySelector('.index .value').innerHTML = this.getValue(day, index);
        clone.querySelector('.date').innerHTML = day.firstTimestamp.format("ddd, MMM Do");

        return clone;
    },

    getValue(day, key) {
        switch (key) {
            case 'temperature': return day.forecasts[0].main.temp;
            case 'humidity': return day.forecasts[0].main.humidity;
            case 'pressure': return day.forecasts[0].main.pressure;
            case 'clouds': return day.forecasts[0].clouds.all;
            case 'wind': return day.forecasts[0].wind.speed;
            case 'rain': return day.totalRain;
            case 'snow': return day.totalSnow;
            default: return 0;
        }
    },

    getForecastGroupByDay (days) {
        const dayMap = new Map();

        days.forEach(item => {
            let timestamp = moment(item.dt * 1000),
                dayOfMonth = timestamp.date();
            
            if (!dayMap.has(dayOfMonth)) {
                dayMap.set(dayOfMonth, {
                    firstTimestamp: timestamp,
                    forecasts : []
                });
            }

            dayMap.get(dayOfMonth).forecasts.push(item);
        });

        //get daily statistics
        dayMap.forEach(day => {
            day.averageTemp = Math.round(100 * day.forecasts
                .reduce((memo, forecast) => memo + forecast.main.temp, 0) / day.forecasts.length) / 100;

            day.totalRain = Math.round(100 * day.forecasts
                .reduce((memo, forecast) => memo + (forecast.rain ? (forecast.rain['3h'] || 0) : 0), 0)) / 100;

            day.totalSnow = Math.round(100 * day.forecasts
                .reduce((memo, forecast) => memo + (forecast.snow['3h'] || 0), 0)) / 100;
        });

        return dayMap;
    },

    updateIndex(newIndex) {
        let dataArray = Array.from(this.forcastByDay.values());

        document.querySelector('.index.selected').classList.remove('selected');
        document.querySelector('.index.' + newIndex).classList.add('selected');
        document.querySelectorAll('.day .index').forEach((dayIndexElement, dayNumber) => {
            dayIndexElement.classList.remove(dayIndexElement.classList[1]);
            dayIndexElement.classList.add(newIndex);
            dayIndexElement.querySelector('.value').innerHTML = this.getValue(dataArray[dayNumber + 1], newIndex);
        });
    },

    getErrorElement (error) {
        let clone = this.getTemplate('template-error');
        
        clone.querySelector('.errorMessage').innerHTML = error.message;
        clone.querySelector('.errorCode').innerHTML = error.cod;
        
        return clone;
    },
};

function DataProvider() {}

DataProvider.prototype = {
    getData() {
        return fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&q='+ cityName +'&appid=' + key)
            .then(response => response.json());
    }
};

if (typeof(window) !== 'undefined') {
    window.addEventListener('load', new WeatherApp(new DataProvider()));
} else {
    module.exports = { WeatherApp, DataProvider };
}