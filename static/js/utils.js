'use strict';

function loadUserCategories(loaded) {
    $.ajax({
        url: '/api/categories',
        dataType: 'json',
        success: function (json) {
            if (json.hasOwnProperty('Categories') && json.Categories[0]) {
                loaded(json.Cafes);
            }
        },
        error: function () {
            alert('Category data is not available. Try again later');
            loaded([]);
        }})
}

function loadUserPlaces(category, loaded) {
    var params = {};
    if (category_id !== 'All') {
        params = {'category': category};
    }

    $.ajax({
        url: '/api/places',
        data: params,
        success: function (json) {
            if (json.hasOwnProperty('Places') && json.Places[0]) {
                loaded(json.Places);
            }
        },
        error: function () {
            alert('Place data is not available. Try again later');
            loaded([]);
        }})
}