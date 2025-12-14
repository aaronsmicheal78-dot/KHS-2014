
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
#from models import User, Savings, Loan, Transaction, MeetingMinute, GalleryItem, Subscription
import json
from datetime import datetime, date
import os
from extensions import db
from werkzeug.utils import secure_filename
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError, InterfaceError
from urllib.parse import quote_plus
from auth import bp as auth_bp
from profile import bp as profile_bp

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production'),
    UPLOAD_FOLDER='static/uploads',
    MAX_CONTENT_LENGTH=16 * 1024 * 1024        # 16MB max file size
)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
# ----------------------------------------------------------
# DATABASE CONFIGURATION
# ---------------------------------------------------------

POSTGRES_ENABLED = True  

POSTGRES_CONFIG = {
    "user": "postgres",
    "password": quote_plus("YOUR_PASSWORD"),  
    "host": "localhost",
    "port": 5432,
    "database": "khs_db",
}

SQLITE_URI = "sqlite:///khs_local.db"

def get_database_uri():
    if not POSTGRES_ENABLED:
        return SQLITE_URI

    try:
        pg_uri = (
            f"postgresql+pg8000://"
            f"{POSTGRES_CONFIG['user']}:{POSTGRES_CONFIG['password']}"
            f"@{POSTGRES_CONFIG['host']}:{POSTGRES_CONFIG['port']}"
            f"/{POSTGRES_CONFIG['database']}"
            f"?ssl_context=false"
        )

        # Test PostgreSQL connection
        engine = create_engine(pg_uri, pool_pre_ping=True)
        with engine.connect():
            pass

        print("✅ Using PostgreSQL (pg8000)")
        return pg_uri

    except (OperationalError, InterfaceError) as e:
        print("⚠ PostgreSQL not available, falling back to SQLite")
        print(f"   Reason: {e.__class__.__name__}")
        return SQLITE_URI


app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# Initialize extensions
db.init_app(app)
print("DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])
CORS(app)
login_manager = LoginManager(app)
login_manager.login_view = 'auth_page'

from models import User, Savings, Loan, Transaction, MeetingMinute, GalleryItem, Subscription
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def home():
    return render_template('auth.html')

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response
  

@app.route('/auth')
def auth_page():
    return render_template('auth.html')


@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    
    # Check if phone already exists
    if User.query.filter_by(phone_number=data['phone']).first():
        return jsonify({'success': False, 'message': 'Phone number already registered'}), 400
    
    # Create new user
    user = User(
        full_name=data['name'],
        phone_number=data['phone']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create default savings accounts
    savings_types = [
        {'type': 'personal', 'balance': 0.00},
        {'type': 'emergency', 'balance': 0.00}
    ]
    
    for savings_data in savings_types:
        savings = Savings(user_id=user.id, **savings_data)
        db.session.add(savings)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'user': {
            'id': user.id,
            'name': user.full_name,
            'member_id': user.member_id
        }
    })

@app.route('/api/dashboard')
@login_required
def api_dashboard():
    # Get user's total savings
    personal_savings = Savings.query.filter_by(
        user_id=current_user.id, 
        type='personal'
    ).first()
    emergency_savings = Savings.query.filter_by(
        user_id=current_user.id, 
        type='emergency'
    ).first()
    
    # Get subscription status
    current_year = date.today().year
    subscription = Subscription.query.filter_by(
        user_id=current_user.id,
        year=current_year
    ).first()
    
    # Get recent transactions
    recent_transactions = Transaction.query.filter_by(
        user_id=current_user.id
    ).order_by(Transaction.created_at.desc()).limit(5).all()
    
    # Get active loans
    active_loans = Loan.query.filter_by(
        user_id=current_user.id,
        status='Active'
    ).all()
    
    return jsonify({
        'savings': {
            'personal': float(personal_savings.balance) if personal_savings else 0.00,
            'emergency': float(emergency_savings.balance) if emergency_savings else 0.00
        },
        'subscription': {
            'status': subscription.status if subscription else 'Not Paid',
            'year': current_year,
            'due_date': subscription.due_date.isoformat() if subscription and subscription.due_date else None
        },
        'loan_eligibility': float(Loan.calculate_eligibility(current_user.id)),
        'recent_transactions': [
            {
                'date': t.created_at.strftime('%Y-%m-%d'),
                'description': t.description,
                'type': t.transaction_type,
                'amount': float(t.amount),
                'status': t.status
            } for t in recent_transactions
        ],
        'active_loans': [
            {
                'id': loan.id,
                'amount': float(loan.amount),
                'remaining': float(loan.remaining_balance) if loan.remaining_balance else float(loan.amount),
                'next_payment': loan.date_due.strftime('%Y-%m-%d') if loan.date_due else None,
                'monthly_payment': float(loan.monthly_payment) if loan.monthly_payment else 0.00
            } for loan in active_loans
        ]
    })

@app.route('/api/savings/deposit', methods=['POST'])
@login_required
def api_savings_deposit():
    data = request.get_json()
    
    # Validate
    if data['amount'] <= 0:
        return jsonify({'success': False, 'message': 'Invalid amount'}), 400
    
    # Get savings account
    savings = Savings.query.filter_by(
        user_id=current_user.id,
        type=data['type']
    ).first()
    
    if not savings:
        return jsonify({'success': False, 'message': 'Savings account not found'}), 404
    
    # Update balance
    savings.balance += data['amount']
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user.id,
        transaction_type=f'savings_deposit_{data["type"]}',
        amount=data['amount'],
        description=f'Deposit to {data["type"]} savings',
        payment_method=data.get('method', 'M-Pesa'),
        status='Completed',
        savings_id=savings.id
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'new_balance': float(savings.balance)
    })

@app.route('/api/loans/apply', methods=['POST'])
@login_required
def api_loan_apply():
    data = request.get_json()
    
    # Check eligibility
    eligibility = Loan.calculate_eligibility(current_user.id)
    if data['amount'] > float(eligibility):
        return jsonify({
            'success': False, 
            'message': f'Loan amount exceeds eligibility limit of UGX {eligibility:,.2f}'
        }), 400
    
    # Create loan application
    loan = Loan(
        user_id=current_user.id,
        loan_number=f"LOAN-{datetime.now().strftime('%Y%m%d')}-{current_user.id:03d}",
        amount=data['amount'],
        purpose=data['purpose'],
        term_months=data['term'],
        status='Pending',
        date_applied=datetime.utcnow()
    )
    
    db.session.add(loan)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Loan application submitted successfully',
        'loan_number': loan.loan_number
    })

@app.route('/api/members')
@login_required
def api_members():
    members = User.query.filter_by(status='Active').order_by(User.full_name).all()
    
    return jsonify({
        'members': [
            {
                'id': m.id,
                'name': m.full_name,
                'member_id': m.member_id,
                'position': m.position,
                'member_since': m.member_since.strftime('%B %Y'),
                'phone': m.phone_number[:3] + '****' + m.phone_number[-3:]  # Mask phone
            } for m in members
        ]
    })

@app.route('/api/logout')
@login_required
def api_logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/test')
def test():
    return render_template('test.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    