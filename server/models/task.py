# app/models/task.py
from datetime import datetime
from extensions import db

class Task(db.Model):
    __tablename__ = 'task'  # explicit table name

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    status      = db.Column(db.String(20), default='pending')
    due_date    = db.Column(db.DateTime)
    
    # FKs
    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    project_id  = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    
    # timestamps
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # relationships
    project     = db.relationship(
        'Project',
        back_populates='tasks',
        cascade='all, delete'
    )
    assignee    = db.relationship(
        'User',
        back_populates='tasks'
    )
    comments    = db.relationship(
        'Comment',
        back_populates='task',
        cascade='all, delete-orphan'
    )

    def serialize(self):
        return {
            'id':            self.id,
            'title':         self.title,
            'description':   self.description,
            'status':        self.status,
            'due_date':      self.due_date.isoformat() if self.due_date else None,
            'assignee_id':   self.assignee_id,
            'project_id':    self.project_id,
            'created_at':    self.created_at.isoformat(),
            'updated_at':    self.updated_at.isoformat()
        }
