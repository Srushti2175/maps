let map, userMarker, directionsService, directionsRenderer, geocoder;
let userCurrentLocation;

// Initialize Google Map
function initMap() {
    const initialLocation = { lat: 20.5937, lng: 78.9629 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: initialLocation
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
    geocoder = new google.maps.Geocoder();
}

// Get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                userCurrentLocation = { lat: userLat, lng: userLng };

                document.getElementById('userLocation').innerHTML = 
                    `Your Current Location: Latitude: ${userLat}, Longitude: ${userLng}`;

                if (userMarker) {
                    userMarker.setPosition(userCurrentLocation);
                } else {
                    userMarker = new google.maps.Marker({
                        position: userCurrentLocation,
                        map: map,
                        label: "You",
                        icon: {
                            url: "https://img.icons8.com/color/48/000000/marker.png",
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });
                }

                animateHologramEffect(userMarker);
                map.setCenter(userCurrentLocation);
                map.setZoom(15);
            },
            (error) => {
                document.getElementById('userLocation').innerHTML = `Error: ${error.message}`;
            }
        );
    } else {
        document.getElementById('userLocation').innerHTML = "Geolocation is not supported by your browser.";
    }
}

// Animate the hologram effect
function animateHologramEffect(marker) {
    setInterval(() => {
        marker.setIcon({
            url: 'https://img.icons8.com/color/48/000000/marker.png',
            scaledSize: new google.maps.Size(60, 60),
            animation: google.maps.Animation.BOUNCE
        });
    }, 1000);
}

// Get directions between two locations
function getDirections() {
    const start = document.getElementById('startLocation').value;
    const end = document.getElementById('endLocation').value;

    if (!start || !end) {
        alert("Please enter both start and end locations.");
        return;
    }

    geocoder.geocode({ address: start }, (results, status) => {
        if (status === 'OK') {
            const startLocation = results[0].geometry.location;

            geocoder.geocode({ address: end }, (results, status) => {
                if (status === 'OK') {
                    const endLocation = results[0].geometry.location;

                    const request = {
                        origin: startLocation,
                        destination: endLocation,
                        travelMode: google.maps.TravelMode.DRIVING
                    };

                    directionsService.route(request, (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsRenderer.setDirections(result);
                            displayDistance(result);
                        } else {
                            alert('Directions request failed: ' + status);
                        }
                    });
                } else {
                    alert('Geocode failed for end location: ' + status);
                }
            });
        } else {
            alert('Geocode failed for start location: ' + status);
        }
    });
}

// Display distance
function displayDistance(result) {
    const route = result.routes[0].legs[0];
    const distanceInKm = route.distance.text;
    document.getElementById('distance').innerHTML = `Distance: ${distanceInKm}`;
}

// Set start location as user's current location
function setCurrentLocationAsStart() {
    if (userCurrentLocation) {
        document.getElementById('startLocation').value = 
            `${userCurrentLocation.lat}, ${userCurrentLocation.lng}`;
    } else {
        alert("Current location is not available. Please enable geolocation.");
    }
}

// Initialize map on page load
window.onload = () => {
    initMap();
    getCurrentLocation();
};
