var map;
var infowindow;

var mapPlaces = {};
var mapMarkers = [];

var currentMarker;

// create Map, InfoWindow object add markers to the map
function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 47.62, lng: -122.27 },
    styles: mapStyle,
    fullscreenControl: false
  });
  infowindow = new google.maps.InfoWindow({
    content: '',
    maxWidth: 250
  });
  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);

  setTimeout(function () {
    mapPlaces = _viewModel.places();
    for (i = 0; i < mapPlaces.length; i++) {
      addMarker(mapPlaces[i]);
    }
  }, 1000);

}

function addMarker(place) {

  var content = '<b>' + place.name + '</b><br/>' + place.description;

  var marker = new google.maps.Marker({
    position: place.coords,
    map: map,
    name: place.name,
    description: place.description,
    category_description: '',
    category: place.category_id,
    animation: google.maps.Animation.DROP,
    icon: "/static/icons/blue-icon.png",
    location: place.coords.lat + "," + place.coords.lng
  });

  loadCategoryInfo(marker.category, function (data) {
    if (data) {
      marker.setOptions({ category_description: data.description });
    }
  });

  // add markers to the map
  mapMarkers.push(marker);

  // add click listener
  google.maps.event.addListener(marker, 'click', (function (marker, content) {
    return function () {
      // change current marker icon color to red
      if (currentMarker) {
        currentMarker.setIcon("/static/icons/blue-icon.png");
      }
      // set marker color to green
      marker.setIcon("/static/icons/green-icon.png");

      // remember current marker
      currentMarker = marker;

      // set infowindow content and open infowindow
      infowindow.setContent(content);
      infowindow.open(map, marker);

      var initialContent = infowindow.getContent();

      if (initialContent != infowindow.getContent()) {
        return;
      }
      if (marker.category_description != '') {
        var description = '';
        description = '<div><b>Category:</b> ' +
                       marker.category_description + '</div>';
        infowindow.setContent(initialContent + description);
      }
    }
  })(marker, content));

  // change icon color if user closes infowindow
  google.maps.event.addListener(infowindow, 'closeclick', (function () {
    return function () {
      currentMarker.setIcon('/static/icons/blue-icon.png');
    }
  })());

  // if marker is not visible, close infowindow and change icon color
  google.maps.event.addListener(marker, 'visible_changed', (function (marker) {
    return function () {
      infowindow.close();
      if (currentMarker) {
        currentMarker.setIcon('/static/icons/blue-icon.png');
      }
    }
  })(marker));
}

// filter markers on the map
filterMarkers = function (category) {
  var text = category;
  console.log(text);
  if (typeof google === 'object' && typeof google.maps === 'object') {
    for (i = 0; i < mapMarkers.length; i++) {
      marker = mapMarkers[i];
      console.log(marker.category_description);
      var match = marker.category_description.indexOf(text) != -1 || text == "All";
      marker.setVisible(match);
    }
  }
}

/**
     * The CenterControl adds a control to the map that recenters the map on
     * Chicago.
     * This constructor takes the control DIV as an argument.
     * @constructor
     */
function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginTop = '10px';
  controlUI.style.marginRight = '13px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Create new point on map (for authenticated users)';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '14px';
  controlText.style.lineHeight = '25px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Add New Point';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function () {
    if (document.getElementById('logoutElem')) {
      map.setOptions({ draggableCursor: 'copy' });
      google.maps.event.addListenerOnce(map, "click", function (event) {
        history.pushState(null, null, "/places/new");
        google.maps.event.addListenerOnce(infowindow, 'closeclick', (function () {
          return function () {
            history.pushState(null, null, "/");
          }
        })());
        map.setOptions({ draggableCursor: 'auto' });
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        var latLng = event.latLng;
        var infoNewPlaceContentElem = document.getElementById('newPlaceForm');
        infoNewPlaceContentHTML = infoNewPlaceContentElem.innerHTML;
        infoNewPlaceContentHTML.className = 'new-place-visible';
        infoNewPlaceContent = infoNewPlaceContentHTML;
        console.log(infoNewPlaceContent);
        infowindow.setContent(infoNewPlaceContent);
        infowindow.setPosition(latLng);
        infowindow.open(map);
        document.getElementById("newPlaceLat").value = latitude;
        document.getElementById("newPlaceLng").value = longitude;

      });
    } else {
      var loginButton = document.getElementById('loginElem');
      loginButton.click();
    }

  });
}

var mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]

// add map to the dom
try {
  initializeMap();
} catch (err) {
  console.log();
}