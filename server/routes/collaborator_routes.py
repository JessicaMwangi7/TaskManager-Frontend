from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.project import Project
from models.collaborator import Collaborator

# Blueprint name must match the variable below
collaborator_bp = Blueprint('collaborator_bp', __name__)

@collaborator_bp.route('/collaborators', methods=['POST'])
@jwt_required()
def add_collaborator():
    data = request.get_json() or {}
    email      = data.get('email')
    project_id = data.get('project_id')

    if not email or not project_id:
        return jsonify({'error': 'Email and project_id required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    # Only project owner can add collaborators
    if project.owner_id != get_jwt_identity():
        return jsonify({'error': 'Only project owner can add collaborators'}), 403

    existing = Collaborator.query.filter_by(
        user_id=user.id,
        project_id=project.id
    ).first()
    if existing:
        return jsonify({'message': 'User is already a collaborator'}), 400

    collaborator = Collaborator(user_id=user.id, project_id=project.id)
    db.session.add(collaborator)
    db.session.commit()

    return jsonify({'message': 'Collaborator added'}), 201
