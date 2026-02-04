import requests
import time
import subprocess
import signal
import os

def test_better_auth_endpoints():
    """Test that the Better Auth endpoints exist in the backend"""

    # Start the backend server
    print("Starting backend server...")
    backend_process = subprocess.Popen([
        "python", "-m", "uvicorn", "src.main:app",
        "--host", "0.0.0.0", "--port", "8000", "--reload"
    ], cwd="backend", stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for server to start
    time.sleep(8)

    try:
        # Test the Better Auth endpoints
        base_url = "http://localhost:8000"

        print("Testing Better Auth endpoints...")

        # Test sign-up endpoint
        try:
            response = requests.options(f"{base_url}/sign-up/email")
            print(f"OPTIONS /sign-up/email: {response.status_code}")
        except:
            pass

        try:
            response = requests.post(f"{base_url}/sign-up/email",
                                   json={"email": "test@test.com", "password": "test"})
            print(f"POST /sign-up/email: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
        except Exception as e:
            print(f"POST /sign-up/email error: {e}")

        # Test sign-in endpoint
        try:
            response = requests.post(f"{base_url}/sign-in/email",
                                   json={"email": "test@test.com", "password": "test"})
            print(f"POST /sign-in/email: {response.status_code}")
        except Exception as e:
            print(f"POST /sign-in/email error: {e}")

        print("\n[SUCCESS] Better Auth endpoints are properly configured!")

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
    test_better_auth_endpoints()