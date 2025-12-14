import os
from dataclasses import dataclass
from typing import Optional
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

@dataclass
class DatabaseConfig:
    """Encapsulates database configuration with validation"""
    dialect: str
    driver: str
    username: str
    password: str
    host: str
    port: int
    database: str
    use_ssl: bool = False
    
    def __post_init__(self):
        self._validate()
    
    def _validate(self):
        if not all([self.username, self.database]):
            raise ValueError("Database configuration incomplete")
    
    @property
    def connection_string(self) -> str:
        """Abstracts connection string generation"""
        credentials = f"{self.username}:{self.password}"
        base_uri = f"{self.dialect}+{self.driver}://{credentials}@{self.host}:{self.port}/{self.database}"
        
        if self.dialect == "postgresql" and not self.use_ssl:
            return f"{base_uri}?ssl_context=false"
        return base_uri

@dataclass
class FileUploadConfig:
    """Encapsulates file upload configuration"""
    upload_folder: str
    max_content_length: int
    allowed_extensions: set
    
    def __post_init__(self):
        # Create upload directory if it doesn't exist
        os.makedirs(self.upload_folder, exist_ok=True)
    
    def is_allowed_file(self, filename: str) -> bool:
        """Validates file extensions"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions

class Config:
    """Main configuration class following Factory pattern"""
    
    # Environment-based configuration
    ENV = os.getenv("FLASK_ENV", "development")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG = ENV == "development"
    
    # Database Configuration Factory
    @classmethod
    def get_database_config(cls) -> DatabaseConfig:
        """Factory method for database configuration"""
        if cls.ENV == "production":
            return DatabaseConfig(
                dialect="postgresql",
                driver="pg8000",
                username=os.getenv("DB_USER", "postgres"),
                password=os.getenv("DB_PASSWORD", ""),
                host=os.getenv("DB_HOST", "localhost"),
                port=int(os.getenv("DB_PORT", 5432)),
                database=os.getenv("DB_NAME", "khs_db"),
                use_ssl=os.getenv("DB_USE_SSL", "false").lower() == "true"
            )
        else:
            # Development configuration
            return DatabaseConfig(
                dialect="sqlite",
                driver="",
                username="",
                password="",
                host="",
                port=0,
                database="khs_local.db"
            )
    
    # File Upload Configuration
    @classmethod
    def get_upload_config(cls) -> FileUploadConfig:
        """Factory method for upload configuration"""
        return FileUploadConfig(
            upload_folder=os.getenv("UPLOAD_FOLDER", "static/uploads"),
            max_content_length=16 * 1024 * 1024,  # 16MB
            allowed_extensions={'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}
        )
    
    # SQLAlchemy Configuration
    @classmethod
    @property
    def SQLALCHEMY_DATABASE_URI(cls) -> str:
        """Property-based database URI with fallback strategy"""
        try:
            config = cls.get_database_config()
            return config.connection_string
        except (ValueError, KeyError) as e:
            print(f"⚠ Database configuration error: {e}, falling back to SQLite")
            return "sqlite:///khs_fallback.db"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SEND_FILE_MAX_AGE_DEFAULT = 0 if DEBUG else 31536000  # 1 year for production
    
    # Session Configuration
    SESSION_TYPE = "filesystem" if ENV == "development" else "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True