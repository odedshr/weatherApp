const key = 'f20a73d3467ff08b53d3ad37ef781115',
    cityName = 'EdinburghXX';

function App(){
    this.getData()
        .then(data => {
            if (data.cod === '200')  {
                this.printCityInfo(data.city);
            } else {
                this.printError(data);
            }
        });
}

App.prototype = {
    getData: function getData() {
        return fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ cityName +'&appid=' + key)
            .then(response => response.json());
    },

    getTemplate: function getTemplate(templateName) {
        return document.importNode(document.getElementById(templateName).content, true);
    },

    printCityInfo: function (city) {
        console.log(city);
        let clone = this.getTemplate('template-cityData');
        clone.querySelector('.cityName').innerHTML = city.name;
        clone.querySelector('.countryName').innerHTML = city.country;
        
        document.body.appendChild(clone);
    },

    printError: function (error) {
        let clone = this.getTemplate('template-error');
        
        clone.querySelector('.errorMessage').innerHTML = error.message;
        clone.querySelector('.errorCode').innerHTML = error.cod;
        
        document.body.appendChild(clone);
    }
};

window.addEventListener('load', new App());