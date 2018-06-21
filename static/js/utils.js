'use strict';

function loadUserCategories(loaded) {
    console.log('categories: sending request');
    $.ajax({
        url: '/api/categories',
        dataType: 'json',
        success: function (json) {
            console.log('categories received');
            if (json.hasOwnProperty('Categories') && json.Categories[0]) {
                loaded(json.Categories);
            }
        },
        error: function () {
            //alert('Category data is not available. Try again later');
            loaded([]);
        }})
}

function loadUserPlaces(category, loaded) {
    console.log('places: sending request');
    $.ajax({
        url: '/api/places',
        data: {'category': category},
        success: function (json) {
            console.log('places received');
            if (json.hasOwnProperty('Places') && json.Places[0]) {
                loaded(json.Places);
            }
        },
        error: function () {
            //alert('Place data is not available. Try again later');
            loaded([]);
        }})
}