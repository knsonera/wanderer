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
    __tablename__ = 'topic'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    user_id = Column(Integer, ForeignKey('appuser.id'))
    user = relationship(AppUser)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'id': self.id,
        }

class Place(Base):
    __tablename__ = 'place'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    description = Column(String(500), nullable=False)
    category = Column(String(250), nullable=False)
    lat = Column(String(25), nullable=False)
    lng = Column(String(25), nullable=False)
    yelpData = Column(String(25), nullable=True)
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
            'category': self.category,
            'coords': { 'lat': float(self.lat), 'lng': float(self.lng) },
            'yelpData': self.yelpData,
            'id': self.id,
        }

engine = create_engine('postgresql://wanderer:11aa22ss@localhost:5432/wanderer',
                    poolclass=StaticPool)

Base.metadata.create_all(engine)
