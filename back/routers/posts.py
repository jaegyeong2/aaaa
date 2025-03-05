from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schema import PostCreate
import schema
import security
from model import Post, User
from sqlalchemy import select

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

class PostWithUsername(schema.Post):
    username: str = None

# 게시물 생성
@router.post("/Create", response_model=schema.Post)
def create_post(
    post: schema.PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user)
):
    db_post = Post(
        title=post.title,
        content=post.content,
        user_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# 게시물 수정
@router.put("/Update/{post_id}", response_model=PostWithUsername)
def update_post(post_id: int, post_data: PostCreate, db: Session = Depends(get_db)):
    print(f"🔍 수정 요청 받은 post_id: {post_id}")  # 로그 추가
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        print("❌ 기존 게시글을 찾을 수 없음!")  # 로그 추가
        raise HTTPException(status_code=404, detail="Post not found")

    print(f"✅ 기존 게시글 수정: {post.id}, {post.title}")  # 로그 추가
    post.title = post_data.title
    post.content = post_data.content
    db.commit()
    db.refresh(post)

    print("✔ 게시글이 정상적으로 수정됨!")  # 로그 추가
    return post

# 게시물 삭제
@router.delete("/Delete", response_model=PostWithUsername)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다")
    
    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="게시물을 삭제할 권한이 없습니다")
    
    result = db_post.__dict__.copy()
    result["username"] = current_user.username
    
    db.delete(db_post)
    db.commit()
    
    return result

# 게시물 목록 조회 
@router.get("/", response_model=List[PostWithUsername])
def get_posts(db: Session = Depends(get_db)):
    stmt = select(
        Post, 
        User.username
    ).join(
        User, 
        Post.user_id == User.id
    ).order_by(Post.created_at.desc())  
    
    results = db.execute(stmt).all()
    if not results:
        raise HTTPException(status_code=404, detail="게시물이 없습니다")
    
    posts = []
    for row in results:
        post_dict = row[0].__dict__.copy()
        post_dict["username"] = row[1]
        posts.append(post_dict)
    
    return posts

# 게시물 상세 조회 
@router.get("/Read/{post_id}", response_model=PostWithUsername)
def read_post(post_id: str, db: Session = Depends(get_db)):
    stmt = select(
        Post, 
        User.username
    ).join(
        User, 
        Post.user_id == User.id
    ).where(
        Post.id == int(post_id)
    )
    
    result = db.execute(stmt).first()
    if result is None:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다")

    post = result[0]
    post.view_count += 1
    db.commit()
    db.refresh(post)
    
    post_dict = post.__dict__.copy()
    post_dict["username"] = result[1]
    
    return post_dict

# 내 게시물 조회
@router.get("/Myposts", response_model=List[PostWithUsername])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user)
):
    stmt = select(
        Post, 
        User.username
    ).join(
        User, 
        Post.user_id == User.id
    ).where(
        Post.user_id == current_user.id
    ).order_by(Post.created_at.desc())
    
    results = db.execute(stmt).all()
    if not results:
        raise HTTPException(status_code=404, detail="게시물이 없습니다")
    
    posts = []
    for row in results:
        post_dict = row[0].__dict__.copy()
        post_dict["username"] = row[1]
        posts.append(post_dict)
    
    return posts