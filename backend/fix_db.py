from sqlalchemy import text
from src.core.database import engine

def add_category_id_column():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE task ADD COLUMN category_id INTEGER"))
            conn.commit()
            print("Successfully added category_id column.")
        except Exception as e:
            print(f"Error (column might already exist): {e}")

if __name__ == "__main__":
    add_category_id_column()
