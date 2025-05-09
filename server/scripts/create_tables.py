import os
import sys

# Add the parent directory to the path so Python can find 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app  # this initializes db with app
from extensions import db   # import AFTER app is created

app = create_app()

with app.app_context():
    db.create_all()
    print("✅ All tables created successfully.")
