const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const { response } = require('express');


var locations = [];

const app = express();

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
                res.send(weatherObject);

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


app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
