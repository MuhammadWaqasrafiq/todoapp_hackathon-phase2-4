import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

# Import the app to see all routes
try:
    from backend.src.main import app
    print("All routes registered in the app:")
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            print(f"  {list(route.methods)} {route.path}")
        else:
            print(f"  Unknown route type: {route}")
except Exception as e:
    print(f"Error importing app: {e}")
    import traceback
    traceback.print_exc()