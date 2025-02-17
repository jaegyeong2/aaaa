from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# 데이터베이스 연결 테스트
engine = create_engine(SQLALCHEMY_DATABASE_URL)
with engine.connect() as connection:
    result = connection.execute("SELECT 1")
    print(result.fetchone())  # 결과가 정상적으로 나오면 연결이 잘 된 것

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:worud12345@database-2.c940uuimi242.ap-northeast-2.rds.amazonaws.com:5432/postgres"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
