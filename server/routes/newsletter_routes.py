from flask import Blueprint, request, jsonify
from extensions import db

newsletter_bp = Blueprint('newsletter_bp', __name__)

@newsletter_bp.route('/newsletter', methods=['POST'])
def subscribe_newsletter():
    data  = request.get_json() or {}
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email required'}), 400

    # TODO: Persist subscription
    # sub = Newsletter(email=email)
    # db.session.add(sub)
    # db.session.commit()

    return jsonify({'message': 'Subscribed successfully'}), 201
