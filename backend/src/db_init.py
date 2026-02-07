from src.core.database import init_db
from seed_categories import seed_categories

def main():
    print("Initializing database...")
    init_db()
    print("Database initialized.")

    print("Seeding categories...")
    seed_categories()

if __name__ == "__main__":
    main()
