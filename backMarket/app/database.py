from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://marketdb_08tt_user:XoJ7QW8aHV5lyvQ8cdht2nlGTwge2fzL@dpg-d0f7faadbo4c73bmmc3g-a.oregon-postgres.render.com/marketdb_08tt"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()