function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15
    });
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(userLocation);
          setupRadiusForm(map, userLocation);
        },
        () => {
          alert('Unable to retrieve your location. Please make sure location access is enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please use a different browser.');
    }
  }
  
  function setupRadiusForm(map, location) {
    const radiusForm = document.getElementById('radius-form');
    const mapContainer = document.getElementById('map');
    const restaurantsContainer = document.getElementById('restaurants-container');
  
    radiusForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const radiusInput = document.getElementById('radius').value;
      const radius = parseInt(radiusInput, 10);
  
      if (!isNaN(radius)) {
        // Show map and restaurants 
        mapContainer.style.display = 'block';
        restaurantsContainer.style.display = 'flex';
        findNearbyRestaurants(map, location, radius);
      } else {
        alert('Invalid radius. Please enter a valid number.');
      }
    });
  }
  
  function findNearbyRestaurants(map, location, radius) {
    const placesService = new google.maps.places.PlacesService(map);
  
    const request = {
      location,
      radius,
      types: ['restaurant']
    };
  
    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        displayRestaurants(results);
      } else {
        console.error('Error fetching nearby restaurants:', status);
      }
    });
  }
  

  function displayRestaurants(restaurants) {
    const container = document.getElementById('restaurants-container');
    container.innerHTML = ''; // Clear previous results
  
    restaurants.forEach((place) => {
      const tile = document.createElement('div');
      tile.className = 'restaurant-tile';
  
      const name = document.createElement('h2');
      name.textContent = place.name;
  
      const address = document.createElement('p');
      address.textContent = place.vicinity;
  
      const phone = place.formatted_phone_number;
  
      const linkContainer = document.createElement('div');
  
      const viewMapLink = document.createElement('button');
      viewMapLink.className = 'button-link';
      viewMapLink.textContent = 'View on Google Maps';
      viewMapLink.addEventListener('click', function () {
        window.open(`https://www.google.com/maps/place/${encodeURIComponent(place.name)},${encodeURIComponent(place.vicinity)}`, '_blank');
      });
  
      linkContainer.appendChild(viewMapLink);
  
      if (phone) {
        const callLink = document.createElement('button');
        callLink.className = 'button-link';
        callLink.textContent = 'Call';
        callLink.addEventListener('click', function () {
          window.open(`tel:${phone}`);
        });
  
        linkContainer.appendChild(callLink);
      }
  
      tile.appendChild(name);
      tile.appendChild(address);
      tile.appendChild(linkContainer);
  
      container.appendChild(tile);
    });
  }
  
  