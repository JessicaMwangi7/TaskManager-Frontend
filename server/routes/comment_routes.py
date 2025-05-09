from flask import Blueprint, request, jsonify
from models.comment import Comment   # ✅ correct
from models.task import Task         # ✅ moved from models.task
from models.user import User         # ✅ moved from models.user
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

comment_bp = Blueprint('comment_bp', __name__)

@comment_bp.route('/comments/<int:task_id>', methods=['GET'])
@jwt_required()
def get_comments(task_id):
    comments = Comment.query.filter_by(task_id=task_id).all()
    return jsonify([{
        'id': c.id,
        'user_email': c.user.email,
        'text': c.text,
        'timestamp': c.timestamp
    } for c in comments])

@comment_bp.route('/comments', methods=['POST'])
@jwt_required()
def add_comment():
    data = request.get_json()
    user_id = get_jwt_identity()
    comment = Comment(
        task_id=data['task_id'],
        user_id=user_id,
        text=data['text']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added'}), 201
