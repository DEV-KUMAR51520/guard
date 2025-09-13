# app/routes/auth.py
# This file is deprecated and has been replaced by the centralized auth-service
# All authentication functionality should be handled through the API Gateway
# which communicates with the auth-service

from flask import Blueprint, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/info', methods=['GET'])
def auth_info():
    """Provide information about the authentication service migration"""
    return jsonify({
        'message': 'Authentication has been migrated to the centralized auth-service',
        'status': 'deprecated',
        'action_required': 'Update your client to use the API Gateway endpoints for authentication'
    }), 200
