# CI/CD Pipeline for a Node.js Application

An end-to-end DevOps pipeline that builds, containerizes, and deploys a Node.js application using **GitHub Actions**, **Docker**, **Docker Compose**, **DockerHub**, and **AWS EC2**.

On every push to `main`, GitHub Actions builds the application, packages it into a Docker image, pushes the image to DockerHub, then connects to an EC2 instance over SSH to pull the latest image and redeploy via Docker Compose.

## Architecture

```
Developer
    │  git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    ├── Build & test application
    ├── Build Docker image
    └── Push image to DockerHub
            │
            ▼
       AWS EC2 Instance
            ├── SSH connection
            ├── Pull latest image
            └── Redeploy via Docker Compose
                    │
                    ▼
             Node.js Application
```

## Features

- Express-based Node.js application with a health-check endpoint
- Containerized with Docker; orchestrated locally and in production with Docker Compose
- Fully automated CI/CD via GitHub Actions
- Images tagged with both `latest` and the commit SHA for traceability
- Zero-downtime-style redeploys on AWS EC2 over SSH
- Secrets-based credential management — no credentials stored in the repository

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend framework | Express.js |
| Frontend | HTML, CSS, JavaScript |
| Containerization | Docker |
| Orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Image registry | DockerHub |
| Hosting | AWS EC2 |
| Deployment transport | SSH |
| Version control | Git / GitHub |

## Project Structure

```
CICD-NodeJs-App/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD pipeline definition
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js                 # Express application entry point
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
└── README.md
```

## CI/CD Workflow

The pipeline runs as two sequential GitHub Actions jobs.

**1. Build & push** *(triggered on push to `main`)*
- Checks out the repository
- Installs dependencies and runs tests
- Builds the Docker image
- Pushes the image to DockerHub, tagged `latest` and with the commit SHA

**2. Deploy**
- Connects to the EC2 instance over SSH
- Pulls the latest image
- Runs `docker compose pull && docker compose up -d` to redeploy
- Prunes unused images to reclaim disk space

Manual equivalents of each step, for reference:

```bash
# Build
docker build -t <dockerhub-username>/cicd-nodejs-app:latest .

# Push
docker push <dockerhub-username>/cicd-nodejs-app:latest

# On the EC2 instance
docker pull <dockerhub-username>/cicd-nodejs-app:latest
docker compose pull
docker compose up -d
```

## Required GitHub Secrets

Configure the following under **Repository → Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | DockerHub account username |
| `DOCKERHUB_TOKEN` | DockerHub personal access token |
| `EC2_HOST` | Public IP address or hostname of the EC2 instance |
| `EC2_USERNAME` | SSH username for the EC2 instance (e.g. `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key used to authenticate to the EC2 instance |

> Credentials, private keys, and other secrets must never be committed to the repository.

## AWS EC2 Prerequisites

The target EC2 instance must have:

- Docker and the Docker Compose plugin installed
- A security group allowing inbound TCP on ports `22` (SSH) and `3000` (application)
- SSH access configured for the key referenced in `EC2_SSH_KEY`
- Network access to DockerHub

One-time setup on a fresh instance:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
git clone https://github.com/<your-username>/CICD-NodeJs-App.git
cd CICD-NodeJs-App
```

Subsequent deployments are handled automatically by the pipeline. Once deployed, the application is reachable at:

```
http://<EC2_PUBLIC_IP>:3000
```

## Local Development

```bash
git clone https://github.com/<your-username>/CICD-NodeJs-App.git
cd CICD-NodeJs-App
npm install
npm start
```

Application available at `http://localhost:3000`.

## Running with Docker

```bash
docker build -t cicd-nodejs-app .
docker run -d -p 3000:3000 cicd-nodejs-app
docker ps
```

## Running with Docker Compose

```bash
docker compose up -d --build   # Build and start
docker compose ps              # Check status
docker compose logs -f         # View logs
docker compose down            # Stop
```
