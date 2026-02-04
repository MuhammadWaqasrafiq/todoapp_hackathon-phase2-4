import requests
import time
import subprocess
import signal

def inspect_routes():
    """Inspect the routes of the running application"""

    # Start the backend server
    print("Starting backend server...")
    backend_process = subprocess.Popen([
        "python", "-m", "uvicorn", "backend.src.main:app",
        "--host", "0.0.0.0", "--port", "8000", "--reload"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for server to start
    time.sleep(8)

    try:
        # Get the OpenAPI schema
        response = requests.get("http://localhost:8000/openapi.json")
        if response.status_code == 200:
            schema = response.json()
            print("Available paths in the API:")
            for path in schema.get('paths', {}):
                methods = list(schema['paths'][path].keys())
                print(f"  {methods} {path}")

            print("\nPaths containing 'sign' or 'auth':")
            for path in schema.get('paths', {}):
                if 'sign' in path.lower() or 'auth' in path.lower():
                    methods = list(schema['paths'][path].keys())
                    print(f"  {methods} {path}")
        else:
            print(f"Failed to get API schema: {response.status_code}")

    except Exception as e:
        print(f"Error inspecting routes: {e}")

    finally:
        # Clean up
        print("\nStopping backend server...")
        try:
            backend_process.terminate()
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()

if __name__ == "__main__":
    inspect_routes()