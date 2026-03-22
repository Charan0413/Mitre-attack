# MITRE ATT&CK - Compromise Accounts Simulation

A complete full-stack web application that demonstrates how an attacker compromises a user account using phishing and stolen credentials, based on the MITRE ATT&CK framework.

## 🎯 Objective

This educational simulation shows the typical steps an attacker takes to compromise an account:
1. **Phishing (T1566)** - Fake login page displayed
2. **Credential Access (T1003)** - User enters credentials  
3. **Valid Accounts (T1078)** - Attacker logs in using stolen account

## 🛠️ Tech Stack

- **Backend**: Python Flask
- **Database**: SQLite (built-in sqlite3 module)
- **Frontend**: HTML5, CSS3, JavaScript (no frameworks)
- **Styling**: Modern CSS with animations and gradients

## 📁 Project Structure

```
/project
│
├── app.py              # Flask backend application
├── database.db         # SQLite database (created by init_db.py)
├── init_db.py          # Database initialization script
├── README.md           # This file
│
├── templates/
│   └── index.html      # Main HTML template
│
└── static/
    ├── style.css       # CSS styling
    └── script.js       # JavaScript functionality
```

## 🚀 Quick Start

### Prerequisites
- Python 3.6 or higher
- No additional packages required (uses built-in modules only)

### Installation & Running

1. **Initialize the database:**
   ```bash
   python init_db.py
   ```
   This creates `database.db` with sample attack simulation data.

2. **Start the Flask application:**
   ```bash
   python app.py
   ```

3. **Open your browser:**
   Navigate to: http://localhost:5000

## 🎮 How to Use

1. Click the **"Start Attack Simulation"** button
2. Watch as each attack step is displayed with a 2-second delay
3. Monitor the real-time attack log showing timestamps
4. View the progress bar as the simulation advances
5. See the final "Account Compromised" status
6. Use the **"Reset Simulation"** button to run it again

### Keyboard Shortcuts
- **Enter/Space**: Start simulation
- **Escape/R**: Reset simulation

## 🎨 Features

### Core Functionality
- ✅ SQLite database with attack simulation data
- ✅ RESTful API endpoint (`/attack`) returning JSON data
- ✅ Progressive step-by-step attack simulation
- ✅ Real-time logging with timestamps
- ✅ Visual progress tracking

### Enhanced UI/UX
- 🎨 Modern gradient design with smooth animations
- 📊 Interactive progress bar
- 📋 Scrollable attack log with syntax highlighting
- 🛡️ Defense tips section with cybersecurity best practices
- 📱 Fully responsive design for mobile devices
- ⚡ Fade-in animations and hover effects

### MITRE ATT&CK Integration
- 🔍 Clear technique ID display (T1566, T1003, T1078)
- 📚 Educational framework context
- ⚠️ Ethical simulation disclaimer

## 🔧 Database Schema

```sql
CREATE TABLE attacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    step TEXT NOT NULL,
    mitre TEXT NOT NULL
);
```

### Sample Data
| Step | MITRE Technique |
|------|-----------------|
| Fake login page displayed | T1566 |
| User enters credentials | T1003 |
| Attacker logs in using stolen account | T1078 |

## 🛡️ Defense Tips Included

The application includes educational defense recommendations:

1. **Strong Passwords** - Complex passwords with mixed characters
2. **Enable 2FA** - Two-factor authentication for extra security
3. **Avoid Phishing** - Verify senders and avoid suspicious links

## 🔒 Security Notes

⚠️ **IMPORTANT**: This is an educational simulation only.
- No real authentication is implemented
- No actual hacking or unauthorized access occurs
- Designed for cybersecurity awareness and training
- Follows ethical guidelines for security education

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill processes using port 5000 (Windows)
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Database not found:**
   - Ensure you ran `python init_db.py` first
   - Check that `database.db` exists in the project directory

3. **Flask not found:**
   ```bash
   pip install flask
   ```

### Debug Mode
The application runs in debug mode by default. You'll see detailed error messages in the terminal if anything goes wrong.

## 📚 MITRE ATT&CK Techniques Used

| Technique ID | Technique Name | Description |
|--------------|----------------|-------------|
| T1566 | Phishing | Targeting users through deceptive emails or websites |
| T1003 | Credential Access | Stealing account credentials for reuse |
| T1078 | Valid Accounts | Using legitimate account credentials for access |

## 🔄 API Endpoints

- `GET /` - Main web interface
- `GET /attack` - Returns JSON array of attack simulation data
- `GET /health` - Health check endpoint

### Example API Response
```json
[
    {
        "step": "Fake login page displayed",
        "mitre": "T1566"
    },
    {
        "step": "User enters credentials", 
        "mitre": "T1003"
    },
    {
        "step": "Attacker logs in using stolen account",
        "mitre": "T1078"
    }
]
```

## 🎓 Educational Purpose

This simulation is designed to help:
- Security professionals understand attack patterns
- Students learn about MITRE ATT&CK framework
- Organizations improve security awareness
- Developers understand secure coding practices

## 📝 License

This project is provided for educational purposes. Please use responsibly and ethically.

---

**Happy Learning! 🚀**
