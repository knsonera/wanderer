var ViewModel = function () {
    var self = this;

    // define model
    var showAll = {description: "All", id: 0, name: "all", user_id: 0}
    self.categories = ko.observableArray([]);
    self.places = ko.observableArray([]);
    self.selectedCategory = ko.observable(showAll);
    self.currentPlace = ko.observable();
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
        console.log('changing current category to ' + category.name);
        self.selectedCategory(category);
    };

    self.setCurrentPlace = function (place) {
        self.currentPlace(place);
    };
}

_viewModel = new ViewModel();
ko.applyBindings(_viewModel);