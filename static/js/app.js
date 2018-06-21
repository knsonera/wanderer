var ViewModel = function () {
    var self = this;

    // define model
    self.selectedCategory = ko.observable("All");
    self.currentPlace = ko.observable(places[0]);
    self.categories = ko.observableArray([]);
    self.places = ko.observableArray([]);
    // (end) define model (end)

    loadUserCategories(function (loadedCategories) {
        self.categories(loadedCategories);
    });

    loadUserPlaces(self.selectedCategory(), function (loadedPlaces) {
        updatePlacesOnMap(loadedPlaces); // TODO: implement
        self.places(loadedPlaces);
    });

    self.setCurrentCategory = function (category) {
        self.selectedCategory(category);
    };

    self.setCurrentPlace = function (place) {
        self.currentPlace(place);
    };
}

_viewModel = new ViewModel();
ko.applyBindings(_viewModel);