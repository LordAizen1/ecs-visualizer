# ECS Privacy Mental Model Visualizer

This project is a web-based dashboard designed to help DevOps engineers visualize their AWS ECS (Elastic Container Service) clusters, services, tasks, and associated IAM roles. It provides interactive graph-based visualizations to improve the understanding of resource relationships and security configurations.

## Features

*   **Interactive Cluster Map:** A graph-based visualization of your ECS cluster, showing the relationships between the cluster, services, and tasks.
*   **Data Flow Visualization:** An interactive diagram that shows how data flows between tasks, dependencies, and resources, along with the permissions used for each interaction.
*   **IAM Summary:** A summary of IAM roles and permissions associated with your ECS tasks.
*   **Filterable Views:** The data flow visualization can be filtered by task, permission type, and risk level.

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (React Framework)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/) (Component Library)
    *   [React Flow](https://reactflow.dev/) (for graph visualizations)
    *   [ELK JS](https://github.com/kieler/elkjs) (for graph layout)
*   **Backend:**
    *   [FastAPI](https://fastapi.tiangolo.com/) (Python Framework)
    *   [Neo4j](https://neo4j.com/) (Graph Database)
    *   [Redis](https://redis.io/) (for caching)
    *   [Docker](https://www.docker.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Docker](https://www.docker.com/products/docker-desktop/)

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

## Usage

1.  Open the application at [http://localhost:3000](http://localhost:3000).
2.  You will be prompted to enter AWS credentials. For local development, you can use the following dummy credentials:
    *   **AWS Access Key ID:** `AKIAIOSFODNN7EXAMPLE`
    *   **AWS Secret Access Key:** `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
3.  Click "Connect" to proceed to the application.
4.  Use the sidebar to navigate between the different visualization pages (Cluster Map, Data Flow, IAM Summary).

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
│   │   ├── cluster-map/
│   │   ├── data-flow/
│   │   └── iam-summary/
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AppSidebar.tsx
│   │   ├── DataFlowGraph.tsx
│   │   ├── DataFlowNode.tsx
│   │   └── reactFlowMap.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── store/              # State management
├── docker-compose.yml      # Defines the backend services (FastAPI, Neo4j, Redis)
├── next.config.ts          # Next.js configuration
├── package.json            # Frontend dependencies and scripts
└── README.md               # This file
```