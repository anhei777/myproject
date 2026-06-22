import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "grade.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")
HOST = "127.0.0.1"
PORT = 5000
SECRET_KEY = "grade-system-dev-key"
