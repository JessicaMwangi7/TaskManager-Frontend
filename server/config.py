from dotenv import load_dotenv
import os

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance', 'taskflow.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "anothersecretkey")
