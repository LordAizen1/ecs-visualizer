***

# Revised Implementation Plan for ECS Mental Model Visualizer

## 1. Project Goal (Short)
Build a secure, interactive React web dashboard that visualizes ECS cluster metadata, IAM roles, and basic data flow between ECS tasks and AWS resources. Evaluate its impact on DevOps engineers’ mental models and permission understanding with a simplified user study.

***

## 2. Architecture Overview

### Backend (FastAPI + Python + Neo4j)
- FastAPI backend running in Docker.
- Uses AWS SDK (boto3) to fetch ECS clusters, services, tasks, and IAM roles.
- Transforms raw AWS data into a graph structured as nodes and edges.
- Stores and queries graph data in Neo4j (Docker container).
- Provides REST endpoints:
  - `/clusters` — list ECS clusters.
  - `/flows?cluster=X` — JSON graph data of cluster flow.
  - `/iam-summary?cluster=X` — IAM roles and permission summaries.
  - `/risks` — manually flagged risky configurations (demo data for MVP).
- Uses AWS STS for temporary credentials refreshed on demand.
- Redis caching for expensive API results only, not credentials.

### Frontend (React + D3.js)
- React single-page application deployed on Vercel or served locally.
- Fetches data from FastAPI backend.
- Visualizes:
  1. **Cluster Map**: Hierarchical view (Cluster → Services → Tasks).
  2. **IAM Summary**: Table of roles and granted permissions.
  3. **Data Flow Graph**: Interactive D3-based visualization showing task connections to AWS resources.
- Modular design for ease of adding views later.
- User-friendly UI with loading states and errors handled gracefully.

### JavaScript Browser Extension (Optional - Minimal)
- Simple MV3 extension that opens the local web dashboard in browser tab.
- Minimal UI/UX due to MV3 constraints.
- Optional; not core MVP.

### Deployment
- Docker Compose on VM or local machine to run FastAPI and Neo4j.
- Redis instance for caching API responses.
- Frontend served separately (local or Vercel).
- Documentation covering setup, build, run instructions.

***

## 3. Data Sources (Phase 1 MVP)
- ECS API: Clusters, Services, Tasks, Task Definitions.
- IAM API: Task Roles and policies.
- Optional CloudTrail / VPC Logs deferred to Phase 2.

***

## 4. Security & Privacy
- Least-privilege IAM roles.
- No storage of static AWS keys; use short-lived STS credentials.
- Local-only data processing, no external transmission.
- Mask sensitive ARNs/IPs in UI during user study.
- Open source code and reproducible build process.

***

## 5. User Study (Simplified)
- Recruit 3–4 DevOps peers.
- Tasks centered on identifying permission risks and understanding data flows.
- Use SUS survey and pre/post mental model mapping.
- Evaluate usability and security comprehension improvements.

***

## 6. Development Phases & Timeline (10–12 weeks)

| Phase              | Deliverables                                    | Timeline (Weeks)          |
|--------------------|------------------------------------------------|--------------------------|
| Phase 1: MVP       | Backend API (ECS + IAM data), Neo4j storage, basic REST endpoints, simple React UI with Cluster Map and IAM Summary | 1–4                      |
| Phase 2: Core Work  | Data Flow Graph visualizations, Redis caching, demo risk flags, API improvements, User study prep | 5–7                      |
| Phase 3: Polish     | Testing, security audit, documentation, user feedback incorporation | 8–9                      |
| Phase 4: User Study | Conduct pilot study, analyze results, finalize reports and presentation | 10–12                    |

***

## 7. Team Roles & Responsibilities

| Team Member        | Role                          | Responsibilities                                                                                  |
|--------------------|-------------------------------|-------------------------------------------------------------------------------------------------|
| **You**            | Systems/Backend Lead           | IAM setup, FastAPI backend development, boto3 AWS integration, AWS STS credential management, Redis caching integration, backend API design |
| **Bhaskar**        | Backend Developer              | AWS data collector scripts, Neo4j graph schema design and ingestion, Cypher query development, backend API support |
| **Kaif**           | Frontend Developer             | React SPA development, D3.js visualizations (Cluster Map, Data Flow Graph), API data consumption, UI/UX polishing |
| **Akshat**         | QA & User Study Coordinator    | Test plan development, API/backend testing, security testing (credentials leaks, permissions), design and coordinate user study tasks and feedback collection |
| **Mayank**         | DevOps & Documentation         | Docker Compose orchestration for FastAPI/Neo4j/Redis, deployment on VM, writing build/run/docs, version control management |

***

## 8. Key Technologies

- **Backend**: FastAPI, Python boto3, Neo4j, Redis (for caching), Docker
- **Frontend**: React, D3.js, Vercel (deployment)
- **AWS Services**: ECS, IAM, STS (for temporary creds)
- **DevOps**: Docker Compose, Linux VM

***

## 9. Additional Recommendations

- Begin with static demo datasets to parallelize frontend/backend development.
- Keep all sensitive credentials in environment variables or AWS Secrets Manager.
- Document security and privacy implications clearly.
***