import subprocess
import os
import sys
import time
import threading

def run_command(command, cwd, label):
    """Effectively runs a command in a specific directory and prints its output."""
    print(f"[{label}] Starting...")
    process = subprocess.Popen(
        command,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=True,
        text=True
    )
    
    # Read output line by line
    for line in iter(process.stdout.readline, ""):
        print(f"[{label}] {line.strip()}")
    
    process.stdout.close()
    return_code = process.wait()
    if return_code != 0:
        print(f"[{label}] Process exited with error code {return_code}")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "DADCMP")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("="*60)
    print("      DADCMP - UNIVERSAL APP STARTER")
    print("="*60)

    # Validate directories
    if not os.path.exists(backend_dir):
        print(f"Error: Backend directory not found at {backend_dir}")
        sys.exit(1)
    if not os.path.exists(frontend_dir):
        print(f"Error: Frontend directory not found at {frontend_dir}")
        sys.exit(1)

    # Commands
    backend_cmd = "mvn spring-boot:run"
    frontend_cmd = "npm start"

    # Start Backend Thread
    backend_thread = threading.Thread(
        target=run_command, 
        args=(backend_cmd, backend_dir, "BACKEND"),
        daemon=True
    )
    
    # Start Frontend Thread
    frontend_thread = threading.Thread(
        target=run_command, 
        args=(frontend_cmd, frontend_dir, "FRONTEND"),
        daemon=True
    )

    backend_thread.start()
    time.sleep(5) # Give backend a small head start
    frontend_thread.start()

    print("\n[SYSTEM] Both applications are starting. Press Ctrl+C to stop.")
    print("[SYSTEM] Backend expected at: http://localhost:8080")
    print("[SYSTEM] Frontend expected at: http://localhost:4200\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[SYSTEM] Stopping applications...")
        # Note: subprocesses will be terminated as threads are daemons
        sys.exit(0)

if __name__ == "__main__":
    main()
