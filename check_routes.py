import sys
sys.path.insert(0, 'backend')

from backend.src.main import app

print("All routes in the application:")
for route in app.routes:
    print(f"  {route.methods} {route.path}")

print("\nRoutes containing 'sign' or 'auth':")
for route in app.routes:
    if 'sign' in route.path.lower() or 'auth' in route.path.lower():
        print(f"  {route.methods} {route.path}")