var map;
var infowindow;

var mapMarkers = [];


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
      map.setOptions({draggableCursor: 'copy'});
      google.maps.event.addListenerOnce(map, "click", function (event) {
        history.pushState(null, null, "/places/new");
        google.maps.event.addListenerOnce(infowindow, 'closeclick', (function () {
          return function () {
            history.pushState(null, null, "/");
          }
        })());
        map.setOptions({draggableCursor: 'auto'});
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        var latLng = event.latLng;
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

var infoNewPlaceContent = '<div class="new-place">' +
                            '<h5 class="new-place-title">' +
                                '<span>Create new place</span>' +
                            '</h5>' +
                            '<form action="#" method="post">' +
                                '<div class="form-group new-place-form">' +
                                    '<input type="text" name="name" class="form-control" id="newPlaceName" placeholder="Name" maxlength=80 required>' +
                                '</div>' +
                                '<div class="form-group new-place-form">' +
                                    '<textarea class="form-control" name="description" id="newPlaceDesc" placeholder="Description" rows="3" maxlength=500 required></textarea>' +
                                '</div>' +
                                '<div class="form-group new-place-form-hidden">' +
                                    '<input type="text" name="lat" class="form-control" id="newPlaceLat" placeholder="Lat" maxlength=80 required>' +
                                '</div>' +
                                '<div class="form-group new-place-form-hidden">' +
                                    '<input type="text" name="lng" class="form-control" id="newPlaceLng" placeholder="Lng" maxlength=80 required>' +
                                '</div>' +
                                '<div class="form-group new-place-form">' +
                                    '<select class="form-control new-place-form" name="category" id="newPlaceCategory" required>' +
                                      '<option class="new-place-form" value="coffee">Coffee Shop</option>' +
                                      '<option class="new-place-form" value="dining">Dining</option>' +
                                      '<option class="new-place-form" value="bars">Bars & Clubs</option>' +
                                      '<option class="new-place-form" value="tourist">Touristy Spots</option>' +
                                      '<option class="new-place-form" value="outdoors">Outdoors</option>' +
                                      '<option class="new-place-form" value="local">Local Gems</option>' +
                                      '<option class="new-place-form" value="kids">Kid-friendly</option>' +
                                      '<option class="new-place-form" value="etc">This And That</option>' +
                                    '</select>' +
                                '</div>' +
                                '<div>' +
                                    '<button type="submit" class="btn btn-sm btn-outline-secondary new-place-submit">Create</button>' +
                                '</div>' +
                            '</form>' +
                          '</div>';

// add map to the dom
try {
  initializeMap();
} catch (err) {
  console.log();
}