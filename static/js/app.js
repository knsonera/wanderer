var UserCategoryModel = {};
var UserPlaceModel = {};

var ViewModel = function () {
    var self = this;

    self.selectedCategory = ko.observable("All");

    _viewModel = new ViewModel();
    ko.applyBindings(_viewModel);
}