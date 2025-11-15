import os
from neo4j import GraphDatabase

# --- Database Connection ---
NEO4J_URI = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "password")

def seed_data():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    with driver.session() as session:
        # Clear existing data
        session.run("MATCH (n) DETACH DELETE n")

        # Create nodes
        session.run("""
            CREATE (t1:Task {id: 'Task-01', name: 'Task-01'})
            CREATE (t2:Task {id: 'Task-02', name: 'Task-02'})
            CREATE (db:Task {id: 'DynamoDB', name: 'DynamoDB'})
            CREATE (t4:Task {id: 'Task-04', name: 'Task-04'})
            CREATE (cd:Cluster {id: 'Cluster-Dev', name: 'Cluster-Dev'})
            CREATE (cp:Cluster {id: 'Cluster-Prod', name: 'Cluster-Prod', isRisky: true})
            CREATE (vd:Endpoint {id: 'Vercel-Dev', name: 'Vercel-Dev', isExternal: true})
            CREATE (vp:Endpoint {id: 'Vercel-Prod', name: 'Vercel-Prod', isExternal: true, isRisky: true})
        """)

        # Create relationships
        session.run("""
            MATCH (t1:Task {id: 'Task-01'}), (cp:Cluster {id: 'Cluster-Prod'})
            CREATE (t1)-[:CONNECTS_TO {isRisky: true}]->(cp)
        """)
        session.run("""
            MATCH (t1:Task {id: 'Task-01'}), (cd:Cluster {id: 'Cluster-Dev'})
            CREATE (t1)-[:CONNECTS_TO]->(cd)
        """)
        session.run("""
            MATCH (t2:Task {id: 'Task-02'}), (t1:Task {id: 'Task-01'})
            CREATE (t2)-[:CONNECTS_TO]->(t1)
        """)
        session.run("""
            MATCH (db:Task {id: 'DynamoDB'}), (t2:Task {id: 'Task-02'})
            CREATE (db)-[:CONNECTS_TO]->(t2)
        """)
        session.run("""
            MATCH (t4:Task {id: 'Task-04'}), (db:Task {id: 'DynamoDB'})
            CREATE (t4)-[:CONNECTS_TO]->(db)
        """)
        session.run("""
            MATCH (cp:Cluster {id: 'Cluster-Prod'}), (vp:Endpoint {id: 'Vercel-Prod'})
            CREATE (cp)-[:CONNECTS_TO {isRisky: true}]->(vp)
        """)
        session.run("""
            MATCH (cd:Cluster {id: 'Cluster-Dev'}), (vd:Endpoint {id: 'Vercel-Dev'})
            CREATE (cd)-[:CONNECTS_TO]->(vd)
        """)

    driver.close()
    print("Successfully seeded the database with sample data.")

if __name__ == "__main__":
    seed_data()
