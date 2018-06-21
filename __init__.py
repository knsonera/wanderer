import sys
import random
import string
import json
import requests

from flask import Flask
from flask import Response
from flask import render_template, redirect, request, url_for, flash, jsonify

# Add CRUD operations
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Place, AppUser, Category

from flask import session as login_session
from sqlalchemy.pool import StaticPool
# Add OAuth operations
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
import httplib2
from flask import make_response

# Create session, connect to db
data = 'postgresql://wnd2r:11aa22ss@localhost:5432/wnd2r'
engine = create_engine(data)
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

app = Flask(__name__)

YELP_API_KEY = 'iZC1vkpIktmdJW4bNLjTuwbuWsdGDDm6C24vQ0oHe20XtH2V3ag_vs85iGroCNffwx1kyZlAN4d5LYM9BBKtkpASg7s1pkLkHvmfJ9-KaOV2_-iSzpttpxcopjgaW3Yx'

# Load client_id for google oauth
CLIENT_ID = json.loads(
    open('/vagrant/wanderer/static/js/client_secrets.json', 'r').read())['web']['client_id']
APPLICATION_NAME = "wanderer"


# render main page
@app.route("/")
def showMainPage():
    return render_template('places.html')


# get all categories for current user
@app.route("/api/categories", methods=['GET'])
def getCategories():
    print "getting categories"
    if 'username' in login_session:
        user_id = getUserId(login_session['email']);
        user_categories = session.query(Category).filter_by(user_id=user_id).all()
        print "returning result"
        return jsonify(Categories=[i.serialize for i in user_categories])
    else:
        print "user not in session"
        return Response('User is not authenticated', status=200)


# get places for current user
@app.route("/api/places", methods=['GET'])
def getPlaces():
    print "getting places"
    if 'username' in login_session:
        user_id = getUserId(login_session['email'])
        print user_id
        current_category = request.args['category']
        
        if current_category == "All":
            print "category equals All"
            user_places = session.query(Place).filter_by(user_id=user_id).all()
        else:
            print current_category
            category_id = getCategoryId(current_category, user_id)
            user_places = session.query(Place).filter_by(user_id=user_id).filter_by(category_id=category_id).all()

        print "returning result"
        return jsonify(Places=[i.serialize for i in user_places])
    else:
        print "user not in session"
        return Response('User is not authenticated', status=200)


# request data from Yelp API
'''
@app.route("/api/get/place")
def getPlaceInfo():
    # request parameters contain term and location of requested place
    term = request.args.get('term')
    location = request.args.get('location')

    http = httplib2.Http()
    # headers of the request contain Yelp API key
    headers = {'Authorization': 'Bearer ' + YELP_API_KEY}
    url = 'https://api.yelp.com/v3/businesses/search?term=' + \
        term + '&location=' + location
    # replacing spaces with url encoding
    url = url.replace(' ', '%20')
    _, content = http.request(url, 'GET', headers=headers)

    # return json object with data
    r = Response(response=content, status=200, mimetype="application/json")
    r.headers["Content-Type"] = "application/json; charset=utf-8"
    return r

# request data from google maps geocoding
@app.route("/api/get/coords")
def getPlaceCoords():
    # request parameters contain term and location of requested place
    address = request.args.get('address')
    http = httplib2.Http()
    # headers of the request contain Yelp API key
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + \
        address + '&key=AIzaSyCMbDSxqs3jlItqgrMyvLT5LlAeDM4BxUc'
    # replacing spaces with url encoding
    url = url.replace(' ', '%20')
    _, content = http.request(url, 'GET')

    # return json object with data
    r = Response(response=content, status=200, mimetype="application/json")
    r.headers["Content-Type"] = "application/json; charset=utf-8"
    return r
'''

# Create new place
@app.route('/categories/new', methods=['POST'])
def newCategory():
    print "creating new category"
    # check user id, only admin can create points
    user_id = getUserId(login_session['email'])
    # add place to database on POST
    if request.method == 'POST':
        print "method POST"
        categoryNameRaw = request.form['name']
        categoryName = categoryNameRaw.replace(' ', '').lower()
        print categoryName
        createdCategory = Category(name=categoryName,
                       description=request.form['name'],
                       user_id=user_id)
        session.add(createdCategory)
        session.commit()
        # redirect to main page
        return redirect(url_for('showMainPage'))
    else:
        # show forms to create new place on GET
        return redirect(url_for('showMainPage'))

# Create new place
@app.route('/places/new', methods=['GET', 'POST'])
def newPlace():
    # check user id, only admin can create points
    user_id = getUserId(login_session['email'])
    # add place to database on POST
    if request.method == 'POST':
        category = request.form['category']
        category_id = getCategoryId(user_id, category)
        newPlace = Place(name=request.form['name'],
                       description=request.form['description'],
                       lat=request.form['lat'],
                       lng=request.form['lng'],
                       category_id=category_id,
                       user_id=user_id)
        session.add(newPlace)
        session.commit()
        # redirect to main page
        return redirect(url_for('showMainPage'))
    else:
        # show forms to create new place on GET
        return redirect(url_for('showMainPage'))

'''
@app.route('/places/delete/<int:place_id>/', methods=['GET', 'POST'])
def deletePlace(place_id):
    # get place to delete from database
    place_to_delete = session.query(Place).filter_by(id=place_id).one()
    # Check if user is allowed to delete topic, show js alert
    if login_session['user_id'] != 1:
        return "<script>function myFunction() {\
                alert('Not authorized.');\
            }</script><body onload='myFunction()'>"
    # delete place from db on POST
    if request.method == 'POST':
        session.delete(place_to_delete)
        session.commit()
        # TODO: flash on success?
        # redirect to main page
        return redirect(url_for('showMainPage'))
    else:
        # make sure user wants to delete place
        return render_template('deletePlace.html',
                               place=place_to_delete)
'''

# Google OAuth
@app.route('/gconnect', methods=['POST'])
def gconnect():
    # Validate state token
    if request.args.get('state') != login_session['_csrf_token']:
        print login_session['_csrf_token']
        print "invalid state parameter"
        response = make_response(json.dumps('Invalid state parameter.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    # Obtain authorization code
    code = request.data

    try:
        print "trying to upgrade auth code"
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('/vagrant/wanderer/static/js/client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        print code
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        print "failed to upgrade the authorization code"
        response = make_response(
            json.dumps('Failed to upgrade the authorization code.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        print "access token info contains error"
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        print "Token's user ID doesn't match given user ID."
        response = make_response(
            json.dumps("Token's user ID doesn't match given user ID."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps("Token's client ID does not match app's."), 401)
        print "Token's client ID does not match app's."
        response.headers['Content-Type'] = 'application/json'
        return response
    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')
    # Check if user is already connected
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        print 'user is in session already, update access token'
        # TODO: try to do disconnect with old token
        # url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' \
        #    % stored_access_token
        # h = httplib2.Http()
        # result = h.request(url, 'GET')[0]
        # print result
        # if result['status'] == '200':
        #    del login_session['access_token']
    else:
        print "user is not connected, connecting..."
        login_session['gplus_id'] = gplus_id

        # Get user info
        userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        params = {'access_token': credentials.access_token, 'alt': 'json'}
        answer = requests.get(userinfo_url, params=params)

        data = answer.json()

        login_session['username'] = data['name']
        login_session['picture'] = data['picture']
        login_session['email'] = data['email']

        user_id = getUserId(login_session['email'])
        if not user_id:
            print "creating new user in db"
            user_id = createUser(login_session)
        login_session['user_id'] = user_id

    # Store the access token in the session.
    login_session['access_token'] = credentials.access_token

    current_user_id = getUserId(login_session['email'])
    current_user = session.query(AppUser).filter_by(id=current_user_id).all()

    print "returning result"
    return jsonify(User=[i.serialize for i in current_user])


# Disconnect (Google OAuth)
@app.route("/gdisconnect")
def gdisconnect():
    access_token = login_session.get('access_token')
    if access_token is None:
        print 'Access Token is None'
        response = make_response(json.dumps('Current user not connected.'),
                                 401)
        response.headers['Content-Type'] = 'application/json'
        status = "Current user not connected."
        return render_template('places.html',
                               user_status=status)
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' \
        % login_session['access_token']
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]

    print result['status']

    if result['status'] == '200':
        print 'status 200'
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        del login_session['user_id']
        response = make_response(json.dumps('Successfully disconnected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        status = "Successfully disconnected."
        return render_template('places.html',
                               user_status=status)
    else:
        # temporary fix, error 400
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        del login_session['user_id']
        print 'Failed to revoke token for given user.'
        response = make_response(
            json.dumps('Failed to revoke token for given user.'), 400
        )
        response.headers['Content-Type'] = 'application/json'
        status = "Failed to revoke token for given user."
        return render_template('places.html',
                               user_status=status)


# API Endpoint: List of places (JSON)
@app.route('/api/users/<int:user_id>/places')
def placesJSON(user_id):
    places = session.query(Place).filter_by(user_id=user_id).all();
    return jsonify(Places=[i.serialize for i in places])


# API Endpoint: List of categories (JSON)
@app.route('/api/users/<int:user_id>/categories')
def categoriesJSON(user_id):
    categories = session.query(Category).filter_by(user_id=user_id).all();
    return jsonify(Categories=[i.serialize for i in categories])


# API Endpoint: List of places in category (JSON)
@app.route('/api/users/<int:user_id>/categories/<int:category_id>/places')
def placesInCategoryJSON(user_id, category_id):
    places = session.query(Place).filter_by(user_id=user_id, category_id=category_id).all();
    return jsonify(PlacesInCategory=[i.serialize for i in places])


# create new user with login session info
def createUser(login_session):
    print "inside createUser function"
    newUser = AppUser(name=login_session['username'],
                      email=login_session['email'],
                      picture=login_session['picture'])
    session.add(newUser)
    session.commit()
    print "returning user..."
    user = session.query(AppUser).filter_by(email=login_session['email']).one()
    print user.id
    return user.id


# get user from db
def getUserInfo(user_id):
    user = session.query(AppUser).filter_by(id=user_id).one()
    return user


# check if user exists in db
def checkUser(login_session):
    current_user_email = login_session['email']
    user = session.query(AppUser).filter_by(email=current_user_email).one()
    if not user:
        createUser(login_session)
    else:
        return user


def getCategoryId(name, user_id):
    try:
        category = session.query(Category).filter_by(name=name, user_id=user_id).one()
        return category.id
    except:
        return None


# get user id 
def getUserId(email):
    try:
        user = session.query(AppUser).filter_by(email=email).one()
        return user.id
    except:
        return None


def generateCSRFToken():
    print "generating csrf token"
    # generate random state
    state = ''.join(random.choice(string.ascii_uppercase + string.digits)
                    for x in range(32))
    login_session['_csrf_token'] = state
    print login_session['_csrf_token']
    return login_session['_csrf_token']

app.jinja_env.globals['csrf_token'] = generateCSRFToken 


app.secret_key = 'trgapsklfhjdsflehfjLKJATLKHNN*YI*YFNO&Iry3noi837rhyg&*&*$#*#*YR&*O#YR#Y$(POUFHLUHFDY'

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
