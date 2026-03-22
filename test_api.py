#!/usr/bin/env python3
"""
Test script to verify the MITRE ATT&CK API endpoint works correctly
"""

import requests
import json

def test_api():
    try:
        # Test the attack endpoint
        response = requests.get('http://localhost:5000/attack')
        
        if response.status_code == 200:
            attacks = response.json()
            print("✅ API Test Successful!")
            print(f"Status Code: {response.status_code}")
            print(f"Number of attack steps: {len(attacks)}")
            print("\nAttack Steps:")
            for i, attack in enumerate(attacks, 1):
                print(f"{i}. {attack['step']} → {attack['mitre']}")
                if attack.get('requires_input'):
                    print(f"   🔄 Interactive: {attack.get('instruction', 'User input required')}")
                print()
            
            # Check for interactive step
            interactive_steps = [a for a in attacks if a.get('requires_input')]
            if interactive_steps:
                print(f"🎯 Found {len(interactive_steps)} interactive step(s)")
            else:
                print("⚠️ No interactive steps found")
            
            return True
        else:
            print(f"❌ API Test Failed!")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the Flask app is running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_api()
