const { response } = require('express');
const request = require('request');

const apiKey = '9ccec11754969db5aea54915fff5d365';

const forecast = (latitude,longitude, callback) =>
{
const apiKey = '9ccec11754969db5aea54915fff5d365';
    const weatherAPIUrl = 'http://api.weatherstack.com/current?access_key='+apiKey+'&query='+latitude+','+longitude+'&units=m';

    request({url: weatherAPIUrl, json: true}, (error,response) => 
    {
        if(error)
        {
            callback('Unable to conenction to weather services!', undefined);
        }
        else if (response.body.error)
        {   
            callback('Error : '+response.body.error.info,undefined);
        }
        else
        {
            callback(undefined, 
                {
                    conditions: response.body.current.weather_descriptions,
                    temperature : response.body.current.temperature,
                    feelslike : response.body.current.feelslike,
                    precipitation : response.body.current.precip,
                    humidity : response.body.current.humidity,
                    icons : response.body.current.weather_icons,
                    windSpeed : response.body.current.wind_speed,
                    windDirection : response.body.current.wind_dir
                });
        }
    });
};

//forecast('49.9','97.13', (req,res) => {console.log(res)} );

module.exports = forecast;