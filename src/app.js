const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const forecastGiphy = require('./utils/giphy');
const { response } = require('express');


var locations = [];

const app = express();

const port = process.env.PORT || 3000;

//Define paths for Express Config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');



//Setup handlebars engine and views locations
app.set('view engine', 'hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);


//Setup static files for use in Express
app.use(express.static(publicDir));


//Helper Functions

const relayConditions = (conditions = '') => 
{
    var relay;

    conditions = conditions.replace('at times', '');
    conditions = conditions.replace('patchy', '');
    conditions = conditions.replace('possible', '');
    conditions = conditions.replace('outbreaks', '');
    conditions = conditions.replace('In Vicinity', '');
    conditions = conditions.replace('Shower','rain');


    // if (conditions.includes('hot') && conditions.includes('humid') )
    // {
    //     relay = '';
    // }
    // else if (conditions.includes('hot') && conditions.includes('arid') )
    // {
    //     relay = '';
    // }
    // else 
    if (((conditions.includes('rain') || conditions.includes('drizzle') || conditions.includes('wet')) && conditions.includes('wind') ))
    {
        //conditions = conditions.replace('rain','');
        //conditions = conditions.replace('drizzle','');
        //conditions = conditions.replace('wet','');
        //conditions = conditions.replace('wind','');
        conditions = 'stormy';
    }

    if(conditions == 'Clear day')
    {
        conditions = 'beautiful day';
    }

    if(conditions == 'Overcast day')
    {
        conditions = 'gray clouds';
    }
    
    return conditions;
};


app.get('', (req,res) => 
{
    res.render('index',
    {
        title: 'Weather App',
        name: 'Mardel Maduro'
    });
});

app.get('/about', (req,res) => 
{
    res.render('about',
    {
        title: 'About Me',
        name: 'Mardel Maduro'
    });
});

app.get('/help', (req,res) => 
{
    res.render('help',
    {
        title: 'Help',
        name: 'Mardel Maduro',
        message: 'For assistance contact site administrator Mardel Maduro'
    });
});


app.get('/weather',(req,res) => 
{
    var weatherObject = {
        forecast: 'Freezing Cold!',
        location: 'Winnipeg',
        //latitude: '',
        //longitude: '',
        address: '',
        giphyLink: ''
    };

   
    
    if(!req.query.address)
    {
        return res.send(
            {
                error: 'You must provide an address'
            });
    } 
    else
    {

        console.log(req.query.address);

        weatherObject.address = req.query.address;

        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send(
                    {
                        error: error
                    });
            }
    
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send(
                        {
                            error: error
                        });
                }
    
                weatherObject.location = location;
                weatherObject.forecast = forecastData;

                var additionalContext = '';

                if(forecastData.temperature > 30)
                {
                    additionalContext +='hot'
                    if(forecastData.humidity > 80)
                    {
                        additionalContext +=',humid'
                    } 
                    if(forecastData.humidity < 10)
                    {
                        additionalContext +=',dry'
                    } 
                }

                else if(forecastData.temperature < -10)
                {
                    additionalContext +='cold'
                }

                if(forecastData.windSpeed > 20)
                {
                    additionalContext +='windy'
                }
                if(forecastData.precipitation > 5)
                {
                    additionalContext +='wet'
                }

                var giphyForcastSearchTerm = '';

                if(weatherObject.forecast.conditions.includes('Sunny') || weatherObject.forecast.conditions.includes('Clear') || weatherObject.forecast.conditions.includes('Partly Cloudy'))
                {
                    if( additionalContext != '')
                    {
                        giphyForcastSearchTerm = additionalContext+' day';
                    }
                    else
                    {
                        giphyForcastSearchTerm = weatherObject.forecast.conditions+' day';
                    }
                    
                }
                
                else {
                    if(additionalContext != '')
                    {
                        giphyForcastSearchTerm = additionalContext+' and '+weatherObject.forecast.conditions+' day';
                    }
                    else
                    {
                        giphyForcastSearchTerm = weatherObject.forecast.conditions+' day';  
                    }
                }

                console.log(relayConditions(giphyForcastSearchTerm));


                 forecastGiphy(relayConditions(giphyForcastSearchTerm),(giphyLink) => {
                    if (error) {
                        return res.send(
                            {
                                error: error
                            });
                    }
                     weatherObject.giphyLink = giphyLink;
                     res.send(weatherObject);
                 });
                
                

                //console.log(forecastData)
            });
        });
    }
});


app.get('/products', (req,res)=>
{

    if(!req.query.search)
    {
        return res.send(
            {
                error: 'You must provide a search term'
            });
    } 
    else
    {

        console.log(req.query.search);

        res.send(
            {
                products: []
            });
    }

    
});

app.get('/help/*', (req,res) =>
{
    res.render('404',
    {
        title: '404',
        name: 'Mardel Maduro',
        errorMessage: 'No article found at this web address.'
    });
});


app.get('*', (req,res) =>
{
    res.render('404',
    {
        title: '404',
        name : 'Mardel Maduro',
        errorMessage: 'Page not found'
    });
});


app.listen(port, () => {
    console.log('Server is up on port '+port);
});

