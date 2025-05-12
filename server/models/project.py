# app/models/project.py

from datetime import datetime
from extensions import db

class Project(db.Model):
    __tablename__ = 'project'  # explicit table name

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    owner_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    owner = db.relationship(
        'User',
        back_populates='projects'
    )
    tasks = db.relationship(
        'Task',
        back_populates='project',
        cascade='all, delete-orphan'
    )
    collaborators = db.relationship(
        'Collaborator',
        back_populates='project',
        cascade='all, delete-orphan'
    )

    def serialize(self):
        """Return a JSON-serializable representation of the project."""
        return {
            'id':           self.id,
            'name':         self.name,
            'description':  self.description,
            'owner_id':     self.owner_id,
            'created_at':   self.created_at.isoformat()
        }
