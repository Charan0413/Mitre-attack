#!/usr/bin/env python3
"""
MITRE ATT&CK Compromise Accounts Simulation
Flask Backend Application
"""

from flask import Flask, jsonify, render_template
import sqlite3
import os

app = Flask(__name__, template_folder="templates", static_folder="static")

app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


def get_db_connection():
    """Create a database connection and return connection object"""
    db_path = os.path.join(os.path.dirname(__file__), "database.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_attack_data():
    """Initialize attack data as fallback if database is not available"""
    return [
        {
            "step": "Fake login page displayed",
            "mitre": "T1566",
            "requires_input": False,
            "input_type": None,
            "expected_input": None,
            "instruction": "Attacker creates a convincing fake login page",
        },
        {
            "step": "User enters credentials",
            "mitre": "T1003",
            "requires_input": True,
            "input_type": "credentials",
            "expected_input": "any",
            "instruction": "Please enter your username and password to continue",
        },
        {
            "step": "Attacker logs in using stolen account",
            "mitre": "T1078",
            "requires_input": False,
            "input_type": None,
            "expected_input": None,
            "instruction": "Valid account credentials used for unauthorized access",
        },
        {
            "step": "Account fully compromised",
            "mitre": "T1078",
            "requires_input": False,
            "input_type": None,
            "expected_input": None,
            "instruction": "Attacker now has full control of the account",
        },
    ]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attack")
def get_attacks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT step, mitre, requires_input, input_type, expected_input, instruction
            FROM attacks
            ORDER BY id
            """
        )
        attacks = cursor.fetchall()
        conn.close()

        attack_list = []
        for attack in attacks:
            attack_list.append(
                {
                    "step": attack["step"],
                    "mitre": attack["mitre"],
                    "requires_input": bool(attack["requires_input"]),
                    "input_type": attack["input_type"],
                    "expected_input": attack["expected_input"],
                    "instruction": attack["instruction"],
                }
            )

        return jsonify(attack_list)

    except Exception as e:
        print(f"Database error: {e}")
        print("Using fallback data")
        return jsonify(init_attack_data())


@app.route("/health")
def health_check():
    return jsonify(
        {"status": "healthy", "message": "MITRE ATT&CK Simulation API"}
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)