# app/models/comment.py

from datetime import datetime
from extensions import db

class Comment(db.Model):
    __tablename__ = 'comment'  # explicit table name

    id         = db.Column(db.Integer,   primary_key=True)
    task_id    = db.Column(db.Integer,   db.ForeignKey('task.id'), nullable=False)
    user_id    = db.Column(db.Integer,   db.ForeignKey('user.id'), nullable=False)
    text       = db.Column(db.Text,      nullable=False)
    created_at = db.Column(db.DateTime,  default=datetime.utcnow)

    # Relationships
    task   = db.relationship(
        'Task',
        back_populates='comments',
        cascade='all, delete'
    )
    author = db.relationship(
        'User',
        back_populates='comments'
    )

    def serialize(self):
        """Return a JSON-serializable representation of the comment."""
        return {
            'id':         self.id,
            'task_id':    self.task_id,
            'user_id':    self.user_id,
            'text':       self.text,
            'created_at': self.created_at.isoformat()
        }
