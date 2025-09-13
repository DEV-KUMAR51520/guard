# app/middleware/auth.py
from functools import wraps
from flask import request, jsonify, current_app
import requests
import os

# Get Auth Service URL from environment variable with fallback
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://auth-service:3001')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-auth-token')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Verify token with Auth Service
            response = requests.get(
                f"{AUTH_SERVICE_URL}/api/auth/verify",
                headers={'x-auth-token': token}
            )
            
            if response.status_code != 200:
                return jsonify({'message': 'Token is invalid'}), 401
            
            # Add user data to request
            request.user = response.json()
            
            return f(*args, **kwargs)
        except requests.RequestException:
            return jsonify({'message': 'Authentication service unavailable'}), 503
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-auth-token')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Check role with Auth Service
            response = requests.get(
                f"{AUTH_SERVICE_URL}/api/auth/role",
                headers={'x-auth-token': token}
            )
            
            if response.status_code != 200:
                return jsonify({'message': 'Token is invalid'}), 401
            
            role_data = response.json()
            
            if not role_data.get('isAdmin', False):
                return jsonify({'message': 'Admin access required'}), 403
            
            return f(*args, **kwargs)
        except requests.RequestException:
            return jsonify({'message': 'Authentication service unavailable'}), 503
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401
    
    return decorated