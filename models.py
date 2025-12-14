
from datetime import datetime
from flask_login import UserMixin
import random
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, DateTime, func



class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    member_id = db.Column(db.String(20), unique=True, nullable=False, default=lambda: f"KHS2014-{datetime.now().strftime('%m%y')}-{random.randint(100, 999)}")
    position = db.Column(db.String(50), default='Member')
    member_since = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Active')  
    profile_image = db.Column(db.String(255), default='default-profile.png')
    email = db.Column(db.String(100), unique=True, nullable=True)
    group = db.Column(db.String(50), default='KHS 2014')
    created_at = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False
)
    # Relationships
    savings = db.relationship('Savings', backref='user', lazy=True, cascade='all, delete-orphan')
    loans = db.relationship('Loan', backref='user', lazy=True, cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'full_name': self.full_name,
            'phone_number': self.phone_number,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Savings(db.Model):
    __tablename__ = 'savings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'personal', 'emergency'
    balance = db.Column(db.Numeric(12, 2), default=0.00)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'type', name='unique_user_savings_type'),
    )

class Loan(db.Model):
    __tablename__ = 'loans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    loan_number = db.Column(db.String(30), unique=True, nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    purpose = db.Column(db.Text)
    term_months = db.Column(db.Integer, nullable=False)  # 3, 6, 12, 24
    interest_rate = db.Column(db.Numeric(5, 2), default=10.00)  # 10% per annum
    status = db.Column(db.String(20), default='Pending')  # Pending, Approved, Active, Completed, Defaulted
    date_applied = db.Column(db.DateTime, default=datetime.utcnow)
    date_approved = db.Column(db.DateTime)
    date_disbursed = db.Column(db.DateTime)
    date_due = db.Column(db.DateTime)
    remaining_balance = db.Column(db.Numeric(12, 2))
    monthly_payment = db.Column(db.Numeric(10, 2))
    
    # Eligibility calculation
    @staticmethod
    def calculate_eligibility(user_id):
        user = User.query.get(user_id)
        total_savings = sum([s.balance for s in user.savings])
        return total_savings * 0.5  

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    transaction_type = db.Column(db.String(30), nullable=False)  # 'savings_deposit', 'loan_repayment', 'loan_disbursement'
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    description = db.Column(db.String(200))
    reference = db.Column(db.String(50), unique=True)
    payment_method = db.Column(db.String(20), default='M-Pesa')  # M-Pesa, Bank Transfer, Cash
    status = db.Column(db.String(20), default='Completed')  # Pending, Completed, Failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Polymorphic relationship
    savings_id = db.Column(db.Integer, db.ForeignKey('savings.id'), nullable=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=True)
    
    savings = db.relationship('Savings', foreign_keys=[savings_id])
    loan = db.relationship('Loan', foreign_keys=[loan_id])

class MeetingMinute(db.Model):
    __tablename__ = 'meeting_minutes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    meeting_date = db.Column(db.Date, nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)  # in bytes
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    download_count = db.Column(db.Integer, default=0)
    
    uploaded_by_user = db.relationship('User', foreign_keys=[uploaded_by])

class GalleryItem(db.Model):
    __tablename__ = 'gallery_items'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255), nullable=False)
    thumbnail_url = db.Column(db.String(255))
    event_date = db.Column(db.Date, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    view_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    
    uploaded_by_user = db.relationship('User', foreign_keys=[uploaded_by])

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='Pending')  # Pending, Paid, Overdue
    payment_date = db.Column(db.DateTime)
    due_date = db.Column(db.Date, nullable=False)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'), nullable=True)
    
    user = db.relationship('User', foreign_keys=[user_id])
    transaction = db.relationship('Transaction', foreign_keys=[transaction_id])
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'year', name='unique_user_year_subscription'),
    )

class Contribution(db.Model):
    __tablename__ = 'contributions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # savings, emergency
    method = db.Column(db.String(50))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200))
    
    user = db.relationship('User', backref='contributions')