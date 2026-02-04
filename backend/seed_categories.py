from sqlmodel import Session, select
from src.core.database import engine
from src.models.category import Category

def seed_categories():
    categories = [
        {"name": "Design", "color": "#FF6B6B"},
        {"name": "Development", "color": "#4ECDC4"},
        {"name": "Marketing", "color": "#FFD166"},
        {"name": "Meeting", "color": "#1A535C"},
        {"name": "Other", "color": "#F7FFF7"},
    ]

    with Session(engine) as session:
        for cat_data in categories:
            statement = select(Category).where(Category.name == cat_data["name"])
            existing = session.exec(statement).first()
            if not existing:
                category = Category(**cat_data)
                session.add(category)
                print(f"Adding category: {cat_data['name']}")
            else:
                print(f"Category already exists: {cat_data['name']}")
        
        session.commit()
    print("Seeding completed.")

if __name__ == "__main__":
    seed_categories()
