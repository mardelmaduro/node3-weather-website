
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
        locationText.textContent = data.location;
        forecastText.textContent = 'Conditions are currently '+data.forecast.conditions;
        forecastText.textContent += '\n With a temperature of '+data.forecast.temperature+ ' but feels like '+data.forecast.feelslike
        conditionsIcon.src = data.forecast.icons[0];

        }
    });
});

});