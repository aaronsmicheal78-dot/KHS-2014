from flask import request, jsonify, Blueprint, session, url_for, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import re
import os
from datetime import datetime
from models import User
from extensions import db

bp = Blueprint('auth', __name__)

def is_valid_phone(phone):
    """Validate phone number (10 digits)"""
    return re.match(r'^\d{10}$', phone) is not None

def is_valid_password(password):
    """Validate password"""
    return len(password) >= 6



@bp.route('/api/register', methods=['POST'])
def register():
    print('REGISTRATION HIT: Processing')
    try:
        data = request.get_json()
        print(f"DATA: {data}")
      
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        full_name = data.get('full_name', '').strip()
        phone_number = data.get('phone_number', '').strip()
        password = data.get('password', '').strip()
        
       
        if not all([full_name, phone_number, password]):
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
      
        if not is_valid_phone(phone_number):
            return jsonify({
                'success': False,
                'message': 'Phone number must be 10 digits'
            }), 400
        
      
        if not is_valid_password(password):
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters'
            }), 400
        
      
        existing_user = User.query.filter_by(phone_number=phone_number).first()
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Phone number already registered'
            }), 400
        
        
        new_user = User(
            full_name=full_name,
           
            phone_number=phone_number
        )
        new_user.set_password(password)
        
       
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'full_name': new_user.full_name,
                
                'phone_number': new_user.phone_number
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500


@bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
      
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        phone_number = data.get('phone_number', '').strip()
        password = data.get('password', '').strip()
        
        if not all([phone_number, password]):
            return jsonify({
                'success': False,
                'message': 'Phone number and password are required'
            }), 400
      
        user = User.query.filter_by(phone_number=phone_number).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Invalid phone number or password'
            }), 401
        session['user_id'] = user.id
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500


@bp.route('/api/health', methods=['GET'])
def health_check():
    """Check API and database health"""
    try:
        # Try to query database
        db.session.execute('SELECT 1')
        return jsonify({
            'success': True,
            'message': 'API and database are running',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Database connection error',
            'error': str(e)
        }), 500
    
@bp.route('/profile')
def profile():
    print('ROUTE HIT')
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))

    user = User.query.get(session['user_id'])  
    return render_template('profile.html', user=user)
