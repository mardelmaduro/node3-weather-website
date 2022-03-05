
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

const locationText = document.querySelector('#location');
const forecastText = document.querySelector('#forecast');
const conditionsIcon = document.querySelector('#conditionsIcon');


weatherForm.addEventListener('submit', (e) =>
{
    e.preventDefault();

    const location = search.value;

    locationText.textContent = 'Loading...';
    forecastText.textContent = '';

    fetch('/weather?address='+location).then((response) =>
{
    response.json().then((data) =>
    {
        if(data.error)
        {
        locationText.textContent = data.error;
        }
        else
        {
        locationText.innerHTML = data.location;
        forecastText.innerHTML = 'Conditions are currently '+data.forecast.conditions+'<br>';

        if(data.forecast.temperature == data.forecast.feelslike)
        {
        forecastText.innerHTML += '<br> With a temperature of '+data.forecast.temperature+ '℃ ';
        }
        else
        {
        forecastText.innerHTML += '<br> With a temperature of '+data.forecast.temperature+ '℃ but it feels like '+data.forecast.feelslike+' ℃.';
        }

        forecastText.innerHTML += '<br> There is currently '+data.forecast.precipitation+'mm of precipitation ';
        forecastText.innerHTML += 'with '+data.forecast.windSpeed+' kmph winds coming in from the '+data.forecast.windDirection;

        conditionsIcon.src = data.forecast.icons[0];

        }
    });
});

});