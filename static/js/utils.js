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

function loadYelpData(name, location, loaded) {
    $.ajax({
        url: '/api/get/yelpdata',
        dataType: 'json',
        data: {"term": name, "location": location},
        success: function (json) {
            if (json.hasOwnProperty('businesses') && json.businesses[0]) {
                var imageUrl = json.businesses[0].image_url || null;
                var rating = json.businesses[0].rating || null;
                var reviewCount = json.businesses[0].review_count || null;
                var price = json.businesses[0].price || null;
                var yelpUrl = json.businesses[0].url || null;

                var yelpData = {
                    available: true,
                    imageUrl: imageUrl,
                    rating: rating,
                    reviewCount: reviewCount,
                    price: price,
                    yelpUrl: yelpUrl
                };

                loaded(yelpData);
            } else {
                var yelpData = {
                    available: false,
                    rating: 'not available',
                    price: 'not available',
                    reviewCount: 0,
                    imageUrl: '',
                    yelpUrl: 'http://www.yelp.com'
                };
                loaded(yelpData);
            }
        },
        error: function () {
            alert('Yelp API is not available. Some information may not be available.');
            loaded(null);
        }
    });
}

function saveYelpData(name, category, image, rating, reviews, price, url) {
    //console.log(name)
    //console.log(category)
    //console.log(image)
    //console.log(rating)
    //console.log(reviews)
    //console.log(price)
    //console.log(url)

    console.log('saving yelp data');
    var data = {'name': name,
        'category': category,
        'image': image,
        'rating': rating,
        'reviews': reviews,
        'price': price,
        'url': url};
    $.ajax({
        url: '/places/save/yelpdata',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function () {
            console.log('yelp data saved');
        },
        error: function () {
            console.log('something went wrong');
        }})
}

function deleteCategory(category) {
    var data = {
        'category': category
    };
    $.ajax({
        url: '/categories/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function () {
            console.log('category successfully deleted');
        },
        error: function () {
            console.log('something went wrong');
        }})
}