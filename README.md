# ECS Privacy Mental Model Visualizer

A comprehensive web-based dashboard designed to help DevOps engineers visualize and understand their AWS ECS (Elastic Container Service) infrastructure, including clusters, services, tasks, IAM roles, permissions, and data flows. This tool provides interactive graph-based visualizations to improve security awareness and resource relationship understanding.

## Features

### Interactive Cluster Map
- Real-time visualization of ECS cluster hierarchy (Cluster → Services → Tasks)
- Interactive node-based graph showing relationships between resources
- Filter by node type (Services, Tasks, Roles, Endpoints)
- Search functionality to quickly find specific resources
- Click on task nodes to view detailed configuration and security information
- Risk highlighting for potentially insecure configurations

### Data Flow Visualization
- Interactive diagram showing data flows between tasks and AWS resources
- Permission-based edge labeling (hover to see specific IAM actions)
- Dynamic filtering by:
  - Task selection
  - Risk level (High, Medium, Low) with live counts
  - Permission type (unused, high-risk)
- Real-time risk metrics and resource weight analysis

### Timeline & Explanation (IAM Summary)
- Time-based analysis of IAM roles and permissions
- Interactive timeline slider (1-365 days back)
- Task, role, and risk level summary table
- AI-powered insights panel with severity indicators
- Dynamic data updates based on selected time range

### Task Details Page
- Comprehensive task configuration and runtime details
- Network and security group information
- IAM permissions breakdown with resource mapping
- External and AWS service endpoint analysis
- Risk and warning indicators
- Breadcrumb navigation for easy context switching

## System Architecture

```mermaid
graph TB
    User[User Browser] --> Frontend[Next.js Frontend<br/>Port 3000]
    Frontend --> API[FastAPI Backend<br/>Port 8001]
    API --> Neo4j[(Neo4j Graph DB<br/>Port 7474/7687)]
    API --> Redis[(Redis Cache<br/>Port 6379)]
    API --> AWS[AWS Services<br/>ECS, IAM, EC2]
    
    subgraph "Docker Environment"
        API
        Neo4j
        Redis
    end
    
    style Frontend fill:#61dafb
    style API fill:#009688
    style Neo4j fill:#008cc1
    style Redis fill:#dc382d
    style AWS fill:#ff9900
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Cache
    participant Neo4j
    participant AWS

    User->>Frontend: Request Cluster Map
    Frontend->>API: GET /api/v1/graph
    API->>Cache: Check cached data
    
    alt Cache Hit
        Cache-->>API: Return cached data
    else Cache Miss
        API->>AWS: Fetch ECS/IAM data
        AWS-->>API: Return resource details
        API->>Neo4j: Store graph data
        API->>Cache: Cache response
    end
    
    API-->>Frontend: Return graph JSON
    Frontend-->>User: Render interactive visualization
```

## Application Structure

```mermaid
graph LR
    subgraph "Frontend Pages"
        Home[Home Page]
        ClusterMap[Cluster Map]
        DataFlow[Data Flow]
        Timeline[Timeline & Explanation]
        TaskDetails[Task Details]
    end
    
    subgraph "Backend Services"
        ECS[ECS Collector]
        IAM[IAM Collector]
        DataFlowSvc[Data Flow Collector]
        Neo4jSvc[Neo4j Service]
        CredMgr[Credential Manager]
    end
    
    ClusterMap --> ECS
    DataFlow --> DataFlowSvc
    Timeline --> IAM
    TaskDetails --> ECS
    
    ECS --> CredMgr
    IAM --> CredMgr
    DataFlowSvc --> CredMgr
    
    ECS --> Neo4jSvc
    IAM --> Neo4jSvc
    DataFlowSvc --> Neo4jSvc
```

## Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React component library
- **[React Flow](https://reactflow.dev/)** - Interactive graph visualizations
- **[ELK.js](https://github.com/kieler/elkjs)** - Automatic graph layout algorithm
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python API framework
- **[Neo4j](https://neo4j.com/)** - Graph database for relationship modeling
- **[Redis](https://redis.io/)** - Caching layer for performance
- **[Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)** - AWS SDK for Python
- **[Docker](https://www.docker.com/)** - Containerization and deployment

## Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** (v18 or later)
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** - For running backend services
- **AWS Account** (for production) or use demo credentials for local development

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LordAizen1/ecs-visualizer.git
   cd ecs-visualizer-backend
   ```

2. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   NEO4J_PASSWORD=your_neo4j_password
   REDIS_URL=redis://redis:6379
   AWS_REGION=us-east-1
   ```

3. **Build and start the backend services:**

   Make sure Docker Desktop is running, then:

   ```bash
   docker-compose up -d --build
   ```

   This will start:
   - FastAPI backend on `http://localhost:8001`
   - Neo4j database on `http://localhost:7474` (UI) and `http://localhost:7687` (Bolt)
   - Redis cache on `http://localhost:6379`

4. **Install frontend dependencies:**

   ```bash
   cd ecs-visualizer
   npm install
   ```

5. **Run the frontend development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Access the application** at [http://localhost:3000](http://localhost:3000)

2. **Enter AWS credentials:** For local development and testing, you can use these dummy credentials:
   - **AWS Access Key ID:** `AKIAIOSFODNN7EXAMPLE`
   - **AWS Secret Access Key:** `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

3. **Navigate the application:**
   - **Home** - Landing page with overview
   - **Cluster Map** - Interactive cluster visualization with filters
   - **Data Flow** - Permission-based data flow diagram
   - **Timeline & Explanation** - Time-based IAM analysis

4. **Interact with visualizations:**
   - Click nodes for detailed information
   - Use filters to focus on specific resources or risks
   - Hover over edges to see permission details
   - Adjust timeline to analyze historical configurations

## Project Structure

```
ecs-visualizer-backend/
├── app/                          # FastAPI backend application
│   ├── api/
│   │   └── endpoints/           # API route handlers
│   │       ├── clusters.py
│   │       ├── flows.py
│   │       ├── graph.py
│   │       ├── iam_summary.py
│   │       ├── nodes.py
│   │       └── risks.py
│   ├── services/                # Business logic services
│   │   ├── aws_credential_manager.py
│   │   ├── data_flow_collector.py
│   │   ├── ecs_collector.py
│   │   ├── iam_collector.py
│   │   └── neo4j_service.py
│   ├── config.py                # Configuration management
│   └── main.py                  # FastAPI application entry point
│
├── ecs-visualizer/              # Next.js frontend application
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── cluster-map/    # Cluster visualization page
│   │   │   │   └── task-details/  # Task detail page
│   │   │   ├── data-flow/      # Data flow diagram page
│   │   │   ├── iam-summary/    # Timeline & Explanation page
│   │   │   └── home/           # Home page
│   │   ├── components/          # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── AppSidebar.tsx  # Application sidebar
│   │   │   ├── CustomNode.tsx  # Custom graph node
│   │   │   ├── DataFlowGraph.tsx
│   │   │   ├── DataFlowNode.tsx
│   │   │   ├── Navbar.tsx      # Top navigation
│   │   │   ├── NodeDetailsSheet.tsx
│   │   │   └── reactFlowMap.tsx
│   │   └── lib/                # Utility functions
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
│
├── docker-compose.yml           # Docker services configuration
├── Dockerfile                   # Backend container definition
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## API Endpoints

The FastAPI backend exposes the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/graph` | GET | Cluster graph data for visualization |
| `/api/v1/nodes` | GET | Detailed node information by ARN |
| `/api/v1/data-flow` | GET | Data flow diagram data with filtering |
| `/api/v1/iam-summary` | GET | IAM analysis with timeline support |
| `/api/v1/clusters` | GET | List all ECS clusters |

### Query Parameters

**`/api/v1/nodes`**
- `node_id` (required) - Full ARN of the resource

**`/api/v1/data-flow`**
- `selected_tasks` - Filter by task IDs
- `show_unused_perms` - Boolean flag
- `show_high_risk_perms` - Boolean flag
- `risk_level` - Comma-separated list: high,medium,low

**`/api/v1/iam-summary`**
- `days_back` - Number of days for historical analysis (1-365)

API documentation is available at [http://localhost:8001/docs](http://localhost:8001/docs) when the backend is running.

## Key Features in Detail

### Cluster Map Filters
- **Search** - Find resources by name
- **Show Risky Only** - Highlight security concerns
- **Show External Only** - Focus on external connections
- **Node Type Toggle** - Show/hide Services, Tasks, Roles, Endpoints

### Data Flow Insights
- **Risk Rate** - Percentage of high-risk permissions
- **Resource Weight** - Total resources accessed
- **Permission Availed** - Permissions currently in use

### Timeline Analysis
- **Adjustable Range** - Analyze 1 to 365 days of history
- **Risk Categorization** - High, Medium, Low severity
- **Contextual Insights** - AI-generated security recommendations

## Security Considerations

- AWS credentials are handled securely using temporary STS tokens
- No credentials are stored in the database
- All communication uses HTTPS (in production)
- IAM roles follow principle of least privilege
- Local development uses isolated Docker networks

## Docker Services

The application uses three containerized services:

| Service | Port(s) | Purpose |
|---------|---------|---------|
| FastAPI Backend | 8001 | REST API server |
| Neo4j Database | 7474, 7687 | Graph data storage |
| Redis Cache | 6379 | Response caching |

## Development

### Running Tests

```bash
# Backend tests
cd ecs-visualizer-backend
python -m pytest

# Frontend tests
cd ecs-visualizer
npm test
```

### Accessing Services

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001
- **API Docs:** http://localhost:8001/docs
- **Neo4j Browser:** http://localhost:7474

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of an academic research initiative focused on improving DevOps security awareness and mental models.

## Authors

**Team Group 41** - Initial work and development

## Acknowledgments

- Built with modern web technologies and cloud-native architecture
- Inspired by the need for better cloud security visualization tools
- Special thanks to the open-source community for the amazing tools and libraries