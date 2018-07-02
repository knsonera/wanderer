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
    var current_category = category.description;
    $.ajax({
        url: '/api/places',
        data: {'category': current_category},
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

function loadCategoryInfo(category_id, loaded) {
    console.log('category: sending request');
    var id = category_id;
    $.ajax({
        url: '/api/get/category',
        data: {'id': id},
        success: function (json) {
            console.log('category received');
            console.log(json);
            if (json.hasOwnProperty('Category')) {
                loaded(json.Category);
            }
        },
        error: function () {
            //alert('Category data is not available. Try again later');
            loaded([]);
        }})
}