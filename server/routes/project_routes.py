from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project import Project
from models.task import Task

project_bp = Blueprint('project_bp', __name__)

@project_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Project name required'}), 400

    user_id = get_jwt_identity()
    proj = Project(
        name       = name,
        description= data.get('description'),
        owner_id   = user_id
    )
    db.session.add(proj)
    db.session.commit()
    return jsonify({'message': 'Project created', 'project_id': proj.id}), 201

@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_id  = get_jwt_identity()
    projects = Project.query.filter(
        (Project.owner_id == user_id) |
        (Project.members.any(id=user_id))
    ).all()
    return jsonify([
        {'id': p.id, 'name': p.name, 'description': p.description}
        for p in projects
    ]), 200

@project_bp.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    proj  = Project.query.get_or_404(project_id)
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify({
        'project': {
            'id': proj.id,
            'name': proj.name,
            'description': proj.description
        },
        'tasks': [
            {
                'id': t.id,
                'title': t.title,
                'description': t.description,
                'status': t.status
            } for t in tasks
        ]
    }), 200
