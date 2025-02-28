from sqlalchemy.orm import Session, aliased
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from model import Post, User
import schema
import security
from sqlalchemy import select

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

# 사용자 이름이 포함된 게시물 응답 스키마
class PostWithUsername(schema.Post):
    username: str = None

# 게시물 목록 조회 - JOIN 사용
@router.get("/", response_model=List[PostWithUsername])
def get_posts(db: Session = Depends(get_db)):
    # Post와 User 테이블을 JOIN하여 한 번에 조회
    stmt = select(
        Post, 
        User.username
    ).join(
        User, 
        Post.user_id == User.id
    )
    
    results = db.execute(stmt).all()
    if not results:
        raise HTTPException(status_code=404, detail="게시물이 없습니다")
    
    # 결과 가공
    posts = []
    for row in results:
        post_dict = row[0].__dict__.copy()
        post_dict["username"] = row[1]
        posts.append(post_dict)
    
    return posts

# 게시물 상세 조회 - JOIN 사용
@router.get("/Read/{post_id}", response_model=PostWithUsername)
def read_post(post_id: int, db: Session = Depends(get_db)):
    # Post와 User 테이블을 JOIN하여 한 번에 조회
    stmt = select(
        Post, 
        User.username
    ).join(
        User, 
        Post.user_id == User.id
    ).where(
        Post.id == post_id
    )
    
    result = db.execute(stmt).first()
    if result is None:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다")
    
    # 조회수 증가
    post = result[0]
    post.view_count += 1
    db.commit()
    db.refresh(post)
    
    # 결과 가공
    post_dict = post.__dict__.copy()
    post_dict["username"] = result[1]
    
    return post_dict