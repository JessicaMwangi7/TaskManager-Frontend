from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.task import Task
from models.comment import Comment

comment_bp = Blueprint('comment_bp', __name__)

@comment_bp.route('/comments/<int:task_id>', methods=['GET'])
@jwt_required()
def get_comments(task_id):
    Task.query.get_or_404(task_id)
    comments = Comment.query.filter_by(task_id=task_id).all()
    return jsonify([
        {
            'id': c.id,
            'user_id': c.user_id,      # or c.author_id if your model uses that
            'text': c.text,
            'timestamp': c.timestamp.isoformat()
        } for c in comments
    ]), 200

@comment_bp.route('/comments', methods=['POST'])
@jwt_required()
def add_comment():
    data    = request.get_json() or {}
    task_id = data.get('task_id')
    text    = data.get('text')

    if not task_id or not text:
        return jsonify({'error': 'task_id and text required'}), 400

    Task.query.get_or_404(task_id)
    comment = Comment(
        task_id = task_id,
        user_id = get_jwt_identity(),
        text    = text
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'id': comment.id, 'message': 'Comment added'}), 201
