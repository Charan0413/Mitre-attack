#!/usr/bin/env python3
"""
MITRE ATT&CK Compromise Accounts Simulation - Enhanced with Defense Scenarios
Database with both attack success and failure scenarios
"""

import sqlite3
import os

def init_defense_database():
    """Initialize the SQLite database with attack and defense scenarios"""
    
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
    
    # Create enhanced attacks table with defense options
    cursor.execute('''
        CREATE TABLE attacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            step TEXT NOT NULL,
            mitre TEXT NOT NULL,
            requires_input BOOLEAN DEFAULT 0,
            input_type TEXT,
            expected_input TEXT,
            instruction TEXT,
            defense_options TEXT,
            success_path TEXT,
            failure_path TEXT
        )
    ''')
    
    # Attack and defense scenarios
    attack_data = [
        (
            "Suspicious email received", 
            "T1566", 
            True, 
            "defense_choice", 
            "any", 
            "You received an email asking you to verify your account. What do you do?",
            '[{"text": "Click the link and enter credentials", "leads_to": "compromise"}, {"text": "Delete the email and report as phishing", "leads_to": "safe"}, {"text": "Verify sender by contacting IT department", "leads_to": "safe"}]',
            'fake_login_page',
            'phishing_detected'
        ),
        (
            "Fake login page displayed", 
            "T1566", 
            False, 
            None, 
            None, 
            "Attacker creates a convincing fake login page",
            None,
            'user_enters_credentials',
            None
        ),
        (
            "User enters credentials", 
            "T1003", 
            True, 
            "credentials", 
            "any", 
            "Please enter your username and password to continue",
            None,
            'credentials_captured',
            None
        ),
        (
            "Credentials captured by attacker", 
            "T1003", 
            False, 
            None, 
            None, 
            "Attacker receives the stolen credentials",
            None,
            'attacker_logs_in',
            None
        ),
        (
            "Attacker logs in using stolen account", 
            "T1078", 
            False, 
            None, 
            None, 
            "Valid account credentials used for unauthorized access",
            None,
            'account_compromised',
            None
        ),
        (
            "Account fully compromised", 
            "T1078", 
            False, 
            None, 
            None, 
            "Attacker now has full control of the account",
            None,
            None,
            None
        ),
        (
            "Phishing detected and reported", 
            "T1566", 
            False, 
            None, 
            None, 
            "User correctly identified phishing attempt and reported it",
            None,
            None,
            None
        ),
        (
            "IT security team notified", 
            "T1566", 
            False, 
            None, 
            None, 
            "Security team blocks the phishing domain and educates users",
            None,
            None,
            None
        ),
        (
            "Account remains secure", 
            "T1566", 
            False, 
            None, 
            None, 
            "Thanks to user awareness, the account was not compromised",
            None,
            None,
            None
        )
    ]
    
    cursor.executemany('''
        INSERT INTO attacks (step, mitre, requires_input, input_type, expected_input, instruction, defense_options, success_path, failure_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', attack_data)
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print("Defense database initialized successfully!")
    print("Created 'attacks' table with 9 enhanced records")
    print("\n🛡️ Defense Scenarios Added:")
    print("- User can choose defense options")
    print("- Branching paths for success/failure")
    print("- Educational feedback for safe choices")
    print("\nMITRE ATT&CK Techniques:")
    print("- T1566: Phishing")
    print("- T1003: Credential Access") 
    print("- T1078: Valid Accounts")
    return True

if __name__ == "__main__":
    init_defense_database()
