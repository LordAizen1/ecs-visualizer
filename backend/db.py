import os
import time
from typing import Union  # <-- Fix 1: Import Union
from neo4j import GraphDatabase, Driver
from neo4j.exceptions import ServiceUnavailable

# --- Database Connection ---
NEO4J_URI = os.environ.get("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "password") # Check your docker-compose.yml!

# Fix 2: Use older Python 3.9 syntax
driver: Union[Driver, None] = None

def get_db():
    global driver  # <-- Fix 3: Add global driver
    if driver is None:
        print("Attempting to connect to Neo4j...")
        # --- Fix 4: Add Retry Loop ---
        retries = 5
        while retries > 0:
            try:
                driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
                driver.verify_connectivity()
                print("Successfully connected to Neo4j")
                break # Success! Exit the loop.
            except ServiceUnavailable as e:
                print(f"Neo4j is not ready, retrying... ({retries} left). Error: {e}")
                retries -= 1
                time.sleep(3) # Wait 3 seconds before trying again
            except Exception as e:
                print(f"Failed to connect to Neo4j: {e}")
                raise
        if driver is None:
            print("Could not connect to Neo4j after all retries.")
            raise Exception("Could not connect to Neo4j")
        # --- End of retry loop ---
        
    return Database(driver)

def close_db():
    global driver  # <-- Fix 3: Add global driver
    if driver is not None:
        driver.close()
        driver = None
        print("Neo4j connection closed")

class Database:
    def __init__(self, driver: Driver):
        self.driver = driver

    def _format_node(self, node):
        node_properties = dict(node)
        return {
            "id": node.element_id,
            "label": list(node.labels)[0] if node.labels else "Node",
            "properties": node_properties
        }

    def _format_edge(self, edge):
        edge_properties = dict(edge)
        return {
            "id": edge.element_id,
            "source": edge.start_node.element_id,
            "target": edge.end_node.element_id,
            "type": edge.type,
            "properties": edge_properties
        }

    def get_graph_data(self):
        with self.driver.session() as session:
            result = session.run("MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m")
            
            nodes = {}
            edges = []

            for record in result:
                if record["n"]:
                    formatted_node_n = self._format_node(record["n"])
                    nodes[formatted_node_n["id"]] = formatted_node_n
                if record["m"]:
                    formatted_node_m = self._format_node(record["m"])
                    nodes[formatted_node_m["id"]] = formatted_node_m
                if record["r"]:
                    edge = self._format_edge(record["r"])
                    edges.append(edge)

            return {"nodes": list(nodes.values()), "edges": edges}