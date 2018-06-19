var UserCategoryModel = {};
var UserPlaceModel = {};

var ViewModel = function () {
    var self = this;

    self.selectedCategory = ko.observable("All");

    self.filteredPlaces = ko.computed(function () {
        var category = self.selectedCategory();
        if (category === "All") {
            //loadUserPlaces(user_id, function(result) {
            //    return result;
            //}
        } else {
            //loadUserPlacesInCategory(user_id, category_id, function(result) {
            //    return result;
            //}
        }
    });

    _viewModel = new ViewModel();
    ko.applyBindings(_viewModel);
}