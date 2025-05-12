from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project import Project
from models.task import Task

# prefix = /api/projects
task_bp = Blueprint('task_bp', __name__, url_prefix='/api/projects')

@task_bp.route('/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def get_tasks(project_id):
    Project.query.get_or_404(project_id)
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify([
        {
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'status': t.status,
            'due_date': t.due_date.isoformat() if t.due_date else None,
            'assignee_id': t.assignee_id
        } for t in tasks
    ]), 200

@task_bp.route('/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def create_task(project_id):
    Project.query.get_or_404(project_id)
    data  = request.get_json() or {}
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title required'}), 400

    task = Task(
        title       = title,
        description = data.get('description'),
        due_date    = data.get('due_date'),
        assignee_id = data.get('assignee_id'),
        project_id  = project_id
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({
        'id': task.id,
        'title': task.title,
        'status': task.status
    }), 201

@task_bp.route('/<int:project_id>/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(project_id, task_id):
    Project.query.get_or_404(project_id)
    task = Task.query.get_or_404(task_id)
    data = request.get_json() or {}
    for f in ('title','description','status','due_date','assignee_id'):
        if f in data:
            setattr(task, f, data[f])
    db.session.commit()
    return jsonify({'message': 'Task updated'}), 200

@task_bp.route('/<int:project_id>/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(project_id, task_id):
    Project.query.get_or_404(project_id)
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200
