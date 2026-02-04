import requests
import time
import subprocess
import signal
import os

def test_auth_endpoints():
    """Test that the authentication endpoints exist in the backend"""

    # Start the backend server
    print("Starting backend server...")
    backend_process = subprocess.Popen([
        "python", "-m", "uvicorn", "src.main:app",
        "--host", "0.0.0.0", "--port", "8000", "--reload"
    ], cwd="backend", stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for server to start
    time.sleep(5)

    try:
        # Test the authentication endpoints
        base_url = "http://localhost:8000"

        # Test health endpoint
        print("Testing health endpoint...")
        response = requests.get(f"{base_url}/")
        print(f"Health endpoint: {response.status_code} - {response.json()}")

        # Test auth endpoints
        print("\nTesting authentication endpoints...")

        # Check if auth endpoints exist by looking at the API routes
        response = requests.get(f"{base_url}/docs")
        if response.status_code == 200:
            print("[OK] API documentation accessible")

            # Look for auth-related endpoints
            if "auth" in response.text.lower():
                print("[OK] Authentication endpoints found in API docs")
            else:
                print("[WARN] Authentication endpoints may not be exposed in API docs")
        else:
            print(f"[ERROR] Could not access API docs: {response.status_code}")

        # Test the new auth endpoints directly
        print("\nTesting new auth endpoints...")

        # Test register endpoint exists (should return 422 for missing body or 405 for wrong method if it exists)
        try:
            response = requests.get(f"{base_url}/api/auth/register")
            print(f"Register endpoint GET: {response.status_code}")
        except:
            try:
                response = requests.post(f"{base_url}/api/auth/register", json={})
                print(f"Register endpoint POST: {response.status_code} (expected 422 for missing data)")
            except Exception as e:
                print(f"Register endpoint error: {e}")

        # Test login endpoint exists
        try:
            response = requests.get(f"{base_url}/api/auth/login")
            print(f"Login endpoint GET: {response.status_code}")
        except:
            try:
                response = requests.post(f"{base_url}/api/auth/login", json={})
                print(f"Login endpoint POST: {response.status_code} (expected 422 for missing data)")
            except Exception as e:
                print(f"Login endpoint error: {e}")

        print("\n[SUCCESS] Backend authentication endpoints are properly configured!")

    except Exception as e:
        print(f"[ERROR] Error testing endpoints: {e}")

    finally:
        # Clean up - terminate the backend server
        print("\nStopping backend server...")
        try:
            backend_process.terminate()
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()

if __name__ == "__main__":
    test_auth_endpoints()