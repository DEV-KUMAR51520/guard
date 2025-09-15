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
