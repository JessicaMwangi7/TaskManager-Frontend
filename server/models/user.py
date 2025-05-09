from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'user'  # ✅ explicit name

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150))  # ✅ add this
    last_name = db.Column(db.String(150))   # ✅ add this
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}

# ✅ Move relationship OUTSIDE class to avoid circular issue
User.projects = db.relationship('Collaborator', back_populates='user')
