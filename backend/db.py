"""
db.py - MySQL connection layer for FinTrack.
Credentials are read from environment variables (.env), never hard-coded.
"""
import os

from dotenv import load_dotenv
from mysql.connector import pooling

load_dotenv()

pool = pooling.MySQLConnectionPool(
    pool_name="fintrack_pool",
    pool_size=5,
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME", "Fin_Track"),
)


def fetch_all(sql, params=()):
    """Run a SELECT with %s placeholders and return a list of dict rows."""
    conn = pool.get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params)
        rows = cur.fetchall()
        cur.close()
        return rows
    finally:
        conn.close()


def execute(sql, params=()):
    """Run INSERT / UPDATE / DELETE. Returns (last_insert_id, affected_rows)."""
    conn = pool.get_connection()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        result = (cur.lastrowid, cur.rowcount)
        cur.close()
        return result
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
