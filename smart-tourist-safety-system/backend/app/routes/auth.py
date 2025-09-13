# app/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.tourist import Tourist
import hashlib
import requests
import os

auth_bp = Blueprint('auth', __name__)

# Get Auth Service URL from environment variable with fallback
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://auth-service:3001')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Forward registration request to Auth Service
        response = requests.post(
            f"{AUTH_SERVICE_URL}/api/auth/register",
            json=data
        )

        # Return the response from Auth Service
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        current_app.logger.error(f"Auth Service connection error: {str(e)}")
        return jsonify({'error': 'Authentication service unavailable'}), 503
    except Exception as e:
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        # Forward login request to Auth Service
        response = requests.post(
            f"{AUTH_SERVICE_URL}/api/auth/login",
            json=data
        )

        # Return the response from Auth Service
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        current_app.logger.error(f"Auth Service connection error: {str(e)}")
        return jsonify({'error': 'Authentication service unavailable'}), 503
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        tourist_id = get_jwt_identity()
        tourist = Tourist.query.get(tourist_id)

        if not tourist:
            return jsonify({'error': 'Tourist not found'}), 404

        return jsonify(tourist.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    try:
        # Get token from header
        token = request.headers.get('x-auth-token')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        # Forward token verification request to Auth Service
        response = requests.get(
            f"{AUTH_SERVICE_URL}/api/auth/verify",
            headers={'x-auth-token': token}
        )

        # Return the response from Auth Service
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        current_app.logger.error(f"Auth Service connection error: {str(e)}")
        return jsonify({'error': 'Authentication service unavailable'}), 503
    except Exception as e:
        current_app.logger.error(f"Token verification error: {str(e)}")
        return jsonify({'error': str(e)}), 500
