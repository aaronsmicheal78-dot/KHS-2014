from flask import jsonify, Blueprint, session, request
from models import User, Contribution
from extensions import db

bp = Blueprint('profile', __name__)

@bp.route('/api/profile')
def api_profile():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict())

from flask import jsonify
from datetime import datetime

@bp.route('/api/savings')
def api_savings():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    # Calculate savings from contributions
    contributions = Contribution.query.filter_by(user_id=user.id).all()
    
    personal_savings = sum(c.amount for c in contributions if c.type == 'savings')
    emergency_fund = sum(c.amount for c in contributions if c.type == 'emergency')
    
    return jsonify({
        'personal_savings': personal_savings,
        'emergency_fund': emergency_fund,
        'total_savings': personal_savings + emergency_fund
    })

@bp.route('/api/transactions/recent')
def api_recent_transactions():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    # Return recent transactions (you'll need to implement this)
    return jsonify([])  # Placeholder

@bp.route('/api/members')
def api_members():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    members = User.query.filter_by(group='KHS 2014').all()
    return jsonify([member.to_dict() for member in members])

@bp.route('/api/members/<int:member_id>')
def api_member_details(member_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    member = User.query.get(member_id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    
    return jsonify(member.to_dict())

@bp.route('/api/contributions', methods=['POST'])
def api_create_contribution():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    amount = data.get('amount')
    contribution_type = data.get('type')
    
    if not amount or amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    # Create contribution record
    contribution = Contribution(
        user_id=session['user_id'],
        amount=amount,
        type=contribution_type,
        date=datetime.utcnow()
    )
    
    db.session.add(contribution)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Contribution recorded'})

@bp.route('/api/contributions')
def api_contributions():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    contributions = Contribution.query.filter_by(user_id=session['user_id']).order_by(Contribution.date.desc()).all()
    
    return jsonify([{
        'id': c.id,
        'amount': c.amount,
        'type': c.type,
        'date': c.date.isoformat() if c.date else None,
        'method': c.method
    } for c in contributions])