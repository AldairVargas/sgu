# Docker Setup Instructions

This project is configured to run with Docker Compose over HTTPS. Because it uses secure connections, you need to generate SSL certificates before running the containers.

## Quick Start

We have provided a setup script that handles everything for you (Networks, Volumes, Certificates, and Startup).

1. Open your terminal in this folder.
2. Run the setup script:
   ```bash
   sh setup_docker.sh
   ```
3. Wait for the build to complete.

## Accessing the Application

- **Frontend**: [https://localhost:3443](https://localhost:3443)
  - **Note**: Since we are using self-signed certificates for local development, your browser will verify a security warning ("Your connection is not private"). This is normal. Click "Advanced" and "Proceed to localhost" (unsafe).
- **Backend API**: [https://localhost:8081](https://localhost:8081)

## Manual Commands (If not using the script)

If you prefer to run commands manually, ensure you create the following resources:

1. **Network**: `docker network create sgu-net`
2. **Volumes**:
   - `docker volume create sgu-volume`
   - `docker volume create certbot-conf`
3. **Certificates**: You must place `fullchain.pem`, `privkey.pem` and `keystore.p12` in the `certbot-conf` volume under `/etc/letsencrypt/live/localhost/`.
4. **Run**: `docker compose up --build`
