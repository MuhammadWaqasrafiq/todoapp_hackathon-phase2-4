import requests
import time
import subprocess

def test_all_possible_endpoints():
    """Test all possible endpoint configurations"""

    # Start the backend server
    print("Starting backend server...")
    backend_process = subprocess.Popen([
        "python", "-m", "uvicorn", "src.main:app",
        "--host", "0.0.0.0", "--port", "8000", "--reload"
    ], cwd="backend", stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait for server to start
    time.sleep(8)

    try:
        base_url = "http://localhost:8000"

        print("Testing various possible endpoints...")

        # Test endpoints that Better Auth might use
        endpoints_to_test = [
            "/sign-up/email",           # Direct root endpoint
            "/api/auth/sign-up/email",  # Expected problematic endpoint
            "/api/sign-up/email",       # Alternative
            "/auth/sign-up/email",      # Another alternative
        ]

        for endpoint in endpoints_to_test:
            try:
                response = requests.post(f"{base_url}{endpoint}",
                                       json={"email": "test@test.com", "password": "test"})
                print(f"POST {endpoint}: {response.status_code}")
                if response.status_code != 404:
                    print(f"  Response preview: {response.text[:100]}...")
            except Exception as e:
                print(f"POST {endpoint}: Error - {e}")

        print("\n[INFO] Endpoint testing completed")

    except Exception as e:
        print(f"[ERROR] Error during testing: {e}")

    finally:
        # Clean up - terminate the backend server
        print("\nStopping backend server...")
        try:
            backend_process.terminate()
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()

if __name__ == "__main__":
    test_all_possible_endpoints()