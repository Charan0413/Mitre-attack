#!/usr/bin/env python3
"""
MITRE ATT&CK Compromise Accounts Simulation
Flask Backend Application

This Flask application serves the web interface and provides
API endpoints for the attack simulation using SQLite database.
"""

from flask import Flask, jsonify, render_template
import sqlite3
import json

app = Flask(__name__)

def get_db_connection():
    """Create a database connection and return connection object"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row  # Enable dictionary-like access
    return conn

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/attack')
def get_attacks():
    """API endpoint to fetch all attack simulation data"""
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch all attack data from database
        cursor.execute('SELECT step, mitre, requires_input, input_type, expected_input, instruction, defense_options, success_path, failure_path FROM attacks ORDER BY id')
        attacks = cursor.fetchall()
        
        # Convert to list of dictionaries
        attack_list = []
        for attack in attacks:
            attack_data = {
                'step': attack['step'],
                'mitre': attack['mitre'],
                'requires_input': bool(attack['requires_input']),
                'input_type': attack['input_type'],
                'expected_input': attack['expected_input'],
                'instruction': attack['instruction']
            }
            
            # Add defense options if present
            if attack['defense_options']:
                try:
                    attack_data['defense_options'] = eval(attack['defense_options'])
                except:
                    attack_data['defense_options'] = []
            else:
                attack_data['defense_options'] = []
            
            # Add path information
            attack_data['success_path'] = attack['success_path']
            attack_data['failure_path'] = attack['failure_path']
            
            attack_list.append(attack_data)
        
        conn.close()
        
        return jsonify(attack_list)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'MITRE ATT&CK Simulation API'})

if __name__ == '__main__':
    print("Starting MITRE ATT&CK Compromise Accounts Simulation...")
    print("Access the application at: http://localhost:5000")
    print("API endpoint: http://localhost:5000/attack")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
