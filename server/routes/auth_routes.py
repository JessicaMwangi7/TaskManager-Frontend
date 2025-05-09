from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__)

# ------------------- SIGNUP ROUTE ------------------- #
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validate input
    required_fields = ['first_name', 'last_name', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'User already exists'}), 400

    # Create new user with hashed password
    new_user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# ------------------- LOGIN ROUTE ------------------- #
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate input
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    # Find user by email
    user = User.query.filter_by(email=data['email']).first()

    # Validate credentials
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Generate JWT token
    access_token = create_access_token(identity=user.id)

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user_id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email
    }), 200
