from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache

# Initialize extensions without app context (for loose coupling)
db = SQLAlchemy()
login_manager = LoginManager()
cors = CORS()
migrate = Migrate()
cache = Cache()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

class ExtensionManager:
    """Manages extension initialization following Facade pattern"""
    
    def __init__(self):
        self.extensions = {
            'db': db,
            'login_manager': login_manager,
            'cors': cors,
            'migrate': migrate,
            'cache': cache,
            'limiter': limiter
        }
    
    def init_app(self, app):
        """Initialize all extensions with the app"""
        for name, extension in self.extensions.items():
            if hasattr(extension, 'init_app'):
                extension.init_app(app)
        
        # Configure login manager
        self.extensions['login_manager'].login_view = 'auth.login'
        self.extensions['login_manager'].login_message_category = 'info'
        
        return self