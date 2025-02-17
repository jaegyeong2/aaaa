from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import schema
import security
from model import User
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import traceback
import logging
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.post("/register", response_model=schema.User)
def create_user(
    user: schema.UserCreate,
    db: Session = Depends(get_db)
):
    logger.debug(f"Received registration request with data: {user.dict(exclude={'password'})}")
    
    try:
        # 데이터베이스 연결 테스트
        try:
            db.execute("SELECT 1")
            logger.debug("Database connection successful")
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection failed"
            )

        # 사용자 중복 체크
        existing_username = db.query(User).filter(User.username == user.username).first()
        if existing_username:
            logger.warning(f"Duplicate username attempted: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            logger.warning(f"Duplicate email attempted: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # 비밀번호 해싱
        try:
            password_hash = security.get_password_hash(user.password)
            logger.debug("Password hashing successful")
        except Exception as e:
            logger.error(f"Password hashing failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Password processing failed"
            )

        # 새 사용자 생성
        try:
            db_user = User(
                username=user.username,
                email=user.email,
                password_hash=password_hash
            )
            logger.debug("User object created successfully")
        except Exception as e:
            logger.error(f"User object creation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User creation failed"
            )

        try:
            db.add(db_user)
            logger.debug("User added to session")
            db.commit()
            logger.debug("Database commit successful")
            db.refresh(db_user)
            logger.debug("User refresh successful")
            return db_user
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error: {str(e)}")
            logger.error(f"Full traceback: {traceback.format_exc()}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
    finally:
        db.close()
# 로그인
@router.post("/users/login", response_model=schema.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = security.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# 현재 로그인된 사용자 정보 반환
@router.get("/me", response_model=schema.User)
def read_user_me(current_user: User = Depends(security.get_current_user)):
    return current_user
