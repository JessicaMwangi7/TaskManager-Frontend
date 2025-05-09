from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import Task, db

task_bp = Blueprint('tasks', __name__, url_prefix='/api/projects')

@task_bp.route('/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def get_tasks(project_id):
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify([t.serialize() for t in tasks]), 200

@task_bp.route('/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def create_task(project_id):
    data = request.get_json()
    task = Task(
        title=data['title'],
        description=data.get('description'),
        due_date=data.get('due_date'),
        assignee_id=data.get('assignee_id'),
        project_id=project_id
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.serialize()), 201
