from flask import Blueprint, request, jsonify
from models.project import Project
from models.task import Task
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

project_bp = Blueprint('project_bp', __name__)

@project_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    user_id = get_jwt_identity()
    project = Project(name=data['name'], description=data.get('description'), creator_id=user_id)
    db.session.add(project)
    db.session.commit()
    return jsonify({'message': 'Project created', 'project_id': project.id}), 201

@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(creator_id=user_id).all()
    return jsonify([{'id': p.id, 'name': p.name, 'description': p.description} for p in projects])

@project_bp.route('/projects/<int:id>', methods=['GET'])
@jwt_required()
def get_project(id):
    project = Project.query.get_or_404(id)
    tasks = Task.query.filter_by(project_id=id).all()
    return jsonify({
        'project': {'id': project.id, 'name': project.name, 'description': project.description},
        'tasks': [{'id': t.id, 'title': t.title, 'description': t.description, 'status': t.status} for t in tasks]
    })
