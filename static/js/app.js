var ViewModel = function () {
    var self = this;

    // define model
    self.selectedCategory = ko.observable("All");
    self.currentPlace = ko.observable();
    self.categories = ko.observableArray([]);
    self.places = ko.observableArray([]);
    // (end) define model (end)

    loadUserCategories(function (loadedCategories) {
        console.log("loading categories");
        self.categories(loadedCategories);
    });

    loadUserPlaces(self.selectedCategory(), function (loadedPlaces) {
        //updatePlacesOnMap(loadedPlaces); // TODO: implement
        console.log("loading places");
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