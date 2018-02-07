const key = 'f20a73d3467ff08b53d3ad37ef781115',
    cityName = 'Edinburgh';

function App(){
    this.getData()
        .then(data => {
            if (data.cod === '200')  {
                this.appendCityInfo(document.body, data.city);
                this.appendWeatherInfo(document.body, data.list);
            } else {
                this.appendError(document.body, data);
            }
        });
}

App.prototype = {
    getData: function getData() {
        return fetch('https://api.openweathermap.org/data/2.5/forecast?units=metric&q='+ cityName +'&appid=' + key)
            .then(response => response.json());
    },

    getTemplate: function getTemplate(templateName) {
        return document.importNode(document.getElementById(templateName).content, true);
    },

    appendCityInfo: function (target, city) {
        let clone = this.getTemplate('template-cityData');
        clone.querySelector('.cityName').innerHTML = city.name;
        clone.querySelector('.countryName').innerHTML = city.country;
        
        target.appendChild(clone);
    },

    appendWeatherInfo: function (target, items) {
        let clone = this.getTemplate('template-weatherList'),
            listDomElement = clone.querySelector('.weatherInformation');
        
        items.forEach(item => {
            this.appendWeatherItem(listDomElement, item);
        });

        target.appendChild(clone);
    },

    appendWeatherItem: function (target, item) {
        let clone = this.getTemplate('template-weatherItem');

        console.log(item);
        clone.querySelector('.weatherIcon').src = 'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png';
        clone.querySelector('.tempValue').innerHTML = item.main.temp;

        target.appendChild(clone);
    },

    appendError: function (target, error) {
        let clone = this.getTemplate('template-error');
        
        clone.querySelector('.errorMessage').innerHTML = error.message;
        clone.querySelector('.errorCode').innerHTML = error.cod;
        
        target.appendChild(clone);
    }
};

window.addEventListener('load', new App());