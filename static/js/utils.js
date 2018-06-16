function loadUserCategories(user_id, loaded) {
    $.ajax({
        url: '/api/users/' + user_id + '/categories',
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

function loadUserPlaces(user_id, loaded) {
    $.ajax({
        url: '/api/users/' + user_id + '/places',
        dataType: 'json',
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

function loadUserPlacesInCategory(user_id, category_id, loaded) {
    $.ajax({
        url: '/api/users/' + user_id + '/categories/' + category_id + '/places',
        dataType: 'json',
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