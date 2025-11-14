# ECS Mental Model Visualizer

This project is a web-based dashboard designed to help DevOps engineers visualize their AWS ECS (Elastic Container Service) clusters, services, tasks, and associated IAM roles. It provides an interactive graph-based visualization to improve the understanding of resource relationships and security configurations.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [AWS CLI](https://aws.amazon.com/cli/) configured with your AWS credentials

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/LordAizen1/ecs-visualizer.git
    cd ecs-visualizer
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Build and start the backend services (FastAPI, Neo4j, Redis):**

    Make sure Docker Desktop is running, then run:

    ```bash
    docker-compose up -d --build
    ```

4.  **Run the frontend development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The backend API will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

```
ecs-visualizer/
├── backend/                # FastAPI backend service
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── public/                 # Static assets for the frontend
├── src/                    # Next.js frontend source code
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── store/              # State management (Zustand)
├── docker-compose.yml      # Defines the backend services (FastAPI, Neo4j, Redis)
├── next.config.ts          # Next.js configuration
├── package.json            # Frontend dependencies and scripts
└── README.md               # This file
```
