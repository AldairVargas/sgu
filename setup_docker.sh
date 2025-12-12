#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting SGU Docker Setup...${NC}"

# 1. Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker Desktop and try again.${NC}"
    exit 1
fi

# 2. Create Network
echo -e "${YELLOW}Creating Docker network 'sgu-net'...${NC}"
docker network inspect sgu-net >/dev/null 2>&1 || docker network create sgu-net

# 3. Create Volumes
echo -e "${YELLOW}Creating Docker volumes...${NC}"
docker volume inspect sgu-volume >/dev/null 2>&1 || docker volume create sgu-volume
docker volume inspect certbot-conf >/dev/null 2>&1 || docker volume create certbot-conf

# 4. Generate SSL Certificates (Self-signed for localhost)
echo -e "${YELLOW}Generating SSL certificates...${NC}"

# Stop containers if running to avoid locks (though unlikely with volumes)
docker compose down >/dev/null 2>&1

# Use a standard alpine image and install openssl to verify control over the environment
docker run --rm -v certbot-conf:/etc/letsencrypt alpine sh -c "
    apk add --no-cache openssl >/dev/null
    
    mkdir -p /etc/letsencrypt/live/localhost
    
    if [ ! -f /etc/letsencrypt/live/localhost/fullchain.pem ]; then
        echo 'Generating self-signed certificate...'
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/letsencrypt/live/localhost/privkey.pem \
            -out /etc/letsencrypt/live/localhost/fullchain.pem \
            -subj '/CN=localhost'
        
        # Convert to PKCS12 for Java/Spring Boot
        echo 'Converting to PKCS12 keystore...'
        openssl pkcs12 -export \
            -in /etc/letsencrypt/live/localhost/fullchain.pem \
            -inkey /etc/letsencrypt/live/localhost/privkey.pem \
            -out /etc/letsencrypt/live/localhost/keystore.p12 \
            -name localhost \
            -passout pass:changeit
            
        chmod 644 /etc/letsencrypt/live/localhost/*
        echo 'Certificates generated successfully.'
    else
        echo 'Certificates already exist. Skipping generation.'
    fi
    
    echo 'Verifying file existence:'
    ls -lR /etc/letsencrypt/live/localhost/
"

# 5. Build and Start Containers
echo -e "${GREEN}Building and starting services...${NC}"
docker compose up --build -d

echo -e "${GREEN}Setup Complete!${NC}"
echo -e "Frontend: ${YELLOW}https://localhost:3443${NC} (Accept the security warning)"
echo -e "Backend:  ${YELLOW}https://localhost:8081${NC}"
