from flask import Blueprint, request, jsonify
from models.collaborator import Collaborator  # ✅ Only import Collaborator from this file
from models.user import User                  # ✅ Import User from models.user
from models.project import Project            # ✅ Import Project from models.project
from extensions import db
from flask_jwt_extended import jwt_required

team_bp = Blueprint('team_bp', __name__)

@team_bp.route('/collaborators', methods=['POST'])
@jwt_required()
def add_collaborator():
    data = request.get_json()

    # Check if user exists
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Optional: Check if project exists
    project = Project.query.get(data['project_id'])
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    # Check if already collaborator
    existing = Collaborator.query.filter_by(user_id=user.id, project_id=project.id).first()
    if existing:
        return jsonify({'message': 'User is already a collaborator'}), 400

    # Create new collaborator
    collaborator = Collaborator(
        user_id=user.id,
        project_id=project.id
        # If your Collaborator model has role → add role=data.get('role')
    )
    db.session.add(collaborator)
    db.session.commit()

    return jsonify({'message': 'Collaborator added'}), 201
