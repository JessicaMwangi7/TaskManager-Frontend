from extensions import db

class Collaborator(db.Model):
    __tablename__ = 'collaborator'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))

    user = db.relationship('User', back_populates='projects')
    project = db.relationship('Project', back_populates='collaborators')
