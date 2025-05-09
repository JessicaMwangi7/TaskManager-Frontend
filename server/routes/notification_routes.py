from flask import Blueprint, jsonify

notification_bp = Blueprint('notification_bp', __name__)

@notification_bp.route('/notifications')
def get_notifications():
    # TODO: fetch from db or static for now
    sample = [
        {'id': 1, 'title': 'Welcome!', 'message': 'Thanks for joining TaskFlow.'},
        {'id': 2, 'title': 'Task Reminder', 'message': 'Task XYZ is due tomorrow.'}
    ]
    return jsonify(sample)
