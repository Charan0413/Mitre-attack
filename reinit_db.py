#!/usr/bin/env python3
"""
Reinitialize database with interactive features
"""

import sqlite3
import os

def reinit_database():
    """Reinitialize the SQLite database with interactive attack simulation data"""
    
    # Remove existing database if it exists
    if os.path.exists('database.db'):
        try:
            os.remove('database.db')
            print("Removed existing database.db")
        except PermissionError:
            print("Database is locked. Please stop the Flask app first.")
            return False
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Create attacks table with additional fields for interactivity
    cursor.execute('''
        CREATE TABLE attacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            step TEXT NOT NULL,
            mitre TEXT NOT NULL,
            requires_input BOOLEAN DEFAULT 0,
            input_type TEXT,
            expected_input TEXT,
            instruction TEXT
        )
    ''')
    
    # Insert sample attack simulation data with interactive elements
    attack_data = [
        (
            "Fake login page displayed", 
            "T1566", 
            False, 
            None, 
            None, 
            "Attacker creates a convincing fake login page"
        ),
        (
            "User enters credentials", 
            "T1003", 
            True, 
            "credentials", 
            "any", 
            "Please enter your username and password to continue"
        ),
        (
            "Credentials captured by attacker", 
            "T1003", 
            False, 
            None, 
            None, 
            "Attacker receives the stolen credentials"
        ),
        (
            "Attacker logs in using stolen account", 
            "T1078", 
            False, 
            None, 
            None, 
            "Valid account credentials used for unauthorized access"
        ),
        (
            "Account fully compromised", 
            "T1078", 
            False, 
            None, 
            None, 
            "Attacker now has full control of the account"
        )
    ]
    
    cursor.executemany('''
        INSERT INTO attacks (step, mitre, requires_input, input_type, expected_input, instruction) 
        VALUES (?, ?, ?, ?, ?, ?)
    ''', attack_data)
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print("Database reinitialized successfully!")
    print("Created 'attacks' table with 5 interactive records")
    print("\nMITRE ATT&CK Techniques:")
    print("- T1566: Phishing")
    print("- T1003: Credential Access") 
    print("- T1078: Valid Accounts")
    print("\nInteractive Features:")
    print("- User credential input simulation")
    print("- Step-by-step attack progression")
    return True

if __name__ == "__main__":
    reinit_database()
