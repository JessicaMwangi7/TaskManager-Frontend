from extensions import db

class Project(db.Model):
    __tablename__ = 'project'  # ✅ Explicit table name

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # ✅ Use module-qualified string for Task relationship
    tasks = db.relationship('Task', backref='project', lazy=True)

    collaborators = db.relationship('Collaborator', back_populates='project')

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
from models.task import Task
from models.collaborator import Collaborator
