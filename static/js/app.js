var ViewModel = function () {
    var self = this;

    // define model
    var showAll = {description: "All", id: 0, name: "all", user_id: 0};
    self.categories = ko.observableArray([]);
    self.places = ko.observableArray([]);
    self.selectedCategory = ko.observable(showAll);
    self.currentPlace = ko.observable();
    // (end) define model (end)

    /*self.fetchSelectedPlaceData = function (place) {
        if (place.yelpData) {
            // cached
            self.currentPlace(place);
        } else {
            loadYelpData(
                place.name,
                place.coords.lat + ',' + place.coords.lng,
                function (data) {
                    place.yelpData = {
                        imageUrl: data.imageUrl,
                        rating: data.rating,
                        reviewCount: data.reviewCount,
                        price: data.price,
                        yelpUrl: data.yelpUrl
                    };
                    self.currentPlace(place);
                }
            );
        }
    }*/

    loadUserCategories(function (loadedCategories) {
        console.log("loading categories");
        console.log(loadedCategories);
        self.categories(loadedCategories);
    });

    loadUserPlaces(self.selectedCategory(), function (loadedPlaces) {
        //updatePlacesOnMap(loadedPlaces); // TODO: implement
        console.log("loading places");
        console.log(loadedPlaces);
        self.places(loadedPlaces);
    });

    self.setCurrentCategory = function (category) {
        console.log('changing current category to ' + category.name);
        self.selectedCategory(category);
        loadUserPlaces(self.selectedCategory(), function (loadedPlaces) {
            self.places(loadedPlaces);
            console.log(loadedPlaces);
        });
    };

    self.setCurrentPlace = function (place) {
        self.currentPlace(place);
    };

    self.placesJS = ko.toJS(self.places);
}

_viewModel = new ViewModel();
ko.applyBindings(_viewModel);