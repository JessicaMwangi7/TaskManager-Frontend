from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from extensions import db
from models.user import User

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}

    # Validate required fields
    required_fields = ['first_name', 'last_name', 'email', 'password']
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    # Prevent duplicate emails
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'User with this email already exists'}), 400

    try:
        # Create and save the new user
        user = User(
            first_name    = data['first_name'],
            last_name     = data['last_name'],
            email         = data['email'],
            password_hash = generate_password_hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email    = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': token,
        'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }
    }), 200
