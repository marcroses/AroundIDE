var watchID = null;

function initLocation()
{
    var options = { timeout: 10000, enableHighAccuracy: true };
    watchID = navigator.geolocation.watchPosition(onSuccessLocation, onErrorLocation, options);	
}

function onSuccessLocation(position) {
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Lat: '  + position.coords.latitude.toFixed(4)  + ' ' +
                        'Lon: ' + position.coords.longitude.toFixed(4);
}

function onErrorLocation(error) {
    console.log('code: '    + error.code    + '\nmessage: ' + error.message + '\n');
}