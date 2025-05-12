# app/models/user.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class User(db.Model):
    __tablename__ = 'user'  # explicit table name

    id            = db.Column(db.Integer, primary_key=True)
    first_name    = db.Column(db.String(150), nullable=False)
    last_name     = db.Column(db.String(150), nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    projects       = db.relationship(
        'Project',
        back_populates='owner',
        cascade='all, delete-orphan'
    )
    tasks          = db.relationship(
        'Task',
        back_populates='assignee',
        cascade='all, delete-orphan'
    )
    comments       = db.relationship(
        'Comment',
        back_populates='author',
        cascade='all, delete-orphan'
    )
    collaborations = db.relationship(
        'Collaborator',
        back_populates='user',
        cascade='all, delete-orphan'
    )

    def set_password(self, password):
        """Hash and store the given password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify a plaintext password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        """Return a JSON-serializable representation of the user."""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
