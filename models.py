import string
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

Base = declarative_base()

class AppUser(Base):
    __tablename__ = 'appuser'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    picture = Column(String(250))

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'email': self.email,
            'picture': self.picture,
            'id': self.id,
        }

class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    description = Column(String(250), nullable=False)
    user_id = Column(Integer, ForeignKey('appuser.id'))
    user = relationship(AppUser)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'description': self.description,
            'user_id': self.user_id,
            'id': self.id,
        }

class Place(Base):
    __tablename__ = 'place'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    description = Column(String(500), nullable=False)
    lat = Column(String(25), nullable=False)
    lng = Column(String(25), nullable=False)
    yelpData = Column(String(25), nullable=True)
    yelp_image_url = Column(String(500), nullable=True)
    yelp_rating = Column(String(25), nullable=True)
    yelp_price = Column(String(25), nullable=True)
    yelp_url = Column(String(250), nullable=True)
    yelp_reviews = Column(String(25), nullable=True)
    category_id = Column(Integer, ForeignKey('category.id'))
    category = relationship(Category)
    user_id = Column(Integer, ForeignKey('appuser.id'))
    user = relationship(AppUser)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'description': self.description,
            'coords': { 'lat': float(self.lat), 'lng': float(self.lng) },
            'yelpData': self.yelpData,
            'yelpImage': self.yelp_image_url,
            'yelpRating': self.yelp_rating,
            'yelpReviews': self.yelp_reviews,
            'yelpPrice': self.yelp_price,
            'yelpUrl': self.yelp_url,
            'category_id': self.category_id,
            'id': self.id,
        }

engine = create_engine('postgresql://wnd2r:11aa22ss@localhost:5432/wnd2r',
                    poolclass=StaticPool)

Base.metadata.create_all(engine)
