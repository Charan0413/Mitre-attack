// MITRE ATT&CK Compromise Accounts Simulation JavaScript

class AttackSimulator {
    constructor() {
        this.attacks = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.stepDelay = 2000; // 2 seconds between steps
        
        // DOM elements
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.currentStepDiv = document.getElementById('currentStep');
        this.attackLog = document.getElementById('attackLog');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.statusMessage = document.getElementById('statusMessage');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.credentialForm = document.getElementById('credentialForm');
        this.loginForm = document.getElementById('loginForm');
        this.formInstruction = document.getElementById('formInstruction');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.clearLogBtn = document.getElementById('clearLogBtn');
        
        this.initializeEventListeners();
        this.initializeTabNavigation();
    }
    
    initializeTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }
    
    switchTab(tabName) {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Remove active class from all tabs and contents
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);
        
        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
        }
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startSimulation());
        this.resetBtn.addEventListener('click', () => this.resetSimulation());
        this.loginForm.addEventListener('submit', (e) => this.handleCredentialSubmit(e));
        this.clearLogBtn.addEventListener('click', () => this.clearLog());
    }
    
    async startSimulation() {
        if (this.isRunning) return;
        
        try {
            // Disable start button and show reset button
            this.startBtn.disabled = true;
            this.resetBtn.style.display = 'inline-block';
            this.isRunning = true;
            
            // Clear previous log
            this.clearLog();
            this.addLogEntry('Simulation started...');
            
            // Fetch attack data from API
            const response = await fetch('/attack');
            if (!response.ok) {
                throw new Error('Failed to fetch attack data');
            }
            
            this.attacks = await response.json();
            this.addLogEntry(`Loaded ${this.attacks.length} attack steps`);
            
            // Start displaying steps
            await this.runSimulation();
            
        } catch (error) {
            console.error('Error:', error);
            this.addLogEntry(`Error: ${error.message}`);
            this.resetSimulation();
        }
    }
    
    async runSimulation() {
        for (let i = 0; i < this.attacks.length; i++) {
            if (!this.isRunning) break;
            
            this.currentStep = i;
            const attack = this.attacks[i];
            
            // Update progress bar
            this.updateProgress(i + 1, this.attacks.length);
            
            // Display current step
            this.displayStep(attack);
            
            // Add to log
            this.addLogEntry(`${attack.step} → ${attack.mitre}`);
            
            // Check if this step requires user input
            if (attack.requires_input) {
                await this.handleInteractiveStep(attack);
            } else {
                // Wait for next step
                if (i < this.attacks.length - 1) {
                    await this.delay(this.stepDelay);
                }
            }
        }
        
        // Show completion message
        if (this.isRunning) {
            this.showCompletion();
        }
    }
    
    displayStep(attack) {
        const stepText = `${attack.step} → ${attack.mitre}`;
        this.currentStepDiv.innerHTML = `
            <div class="step-animation">
                <span class="step-icon">⚡</span>
                <span class="step-text">${stepText}</span>
            </div>
        `;
        
        // Add fade-in animation
        this.currentStepDiv.style.animation = 'none';
        setTimeout(() => {
            this.currentStepDiv.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
    
    async handleInteractiveStep(attack) {
        return new Promise((resolve) => {
            this.interactiveStepResolver = resolve;
            
            // Show credential form
            this.currentStepDiv.style.display = 'none';
            this.credentialForm.style.display = 'block';
            
            // Update form instruction if available
            if (attack.instruction) {
                this.formInstruction.textContent = attack.instruction;
            }
            
            // Focus on username field
            setTimeout(() => {
                this.usernameInput.focus();
            }, 500);
            
            this.addLogEntry('🔐 Waiting for user to enter credentials...');
        });
    }
    
    handleCredentialSubmit(event) {
        event.preventDefault();
        
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;
        
        if (!username || !password) {
            this.addLogEntry('❌ Please enter both username and password');
            return;
        }
        
        // Log the credential submission (masked for security)
        this.addLogEntry(`🔓 Credentials submitted: ${username} → ${'*'.repeat(password.length)}`);
        
        // Hide credential form and show step display
        this.credentialForm.style.display = 'none';
        this.currentStepDiv.style.display = 'block';
        
        // Clear form
        this.loginForm.reset();
        
        // Resolve the promise to continue simulation
        if (this.interactiveStepResolver) {
            this.interactiveStepResolver();
            this.interactiveStepResolver = null;
        }
    }
    
    updateProgress(current, total) {
        const percentage = Math.round((current / total) * 100);
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
    }
    
    clearLog() {
        this.attackLog.innerHTML = '';
        this.addLogEntry('Log cleared by user');
    }
    
    addLogEntry(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        // Parse message to highlight MITRE technique
        const parts = message.split(' → ');
        if (parts.length === 2) {
            logEntry.innerHTML = `
                <span class="log-time">[${timestamp}]</span> 
                <span class="log-step">${parts[0]}</span> → 
                <span class="log-mitre">${parts[1]}</span>
            `;
        } else {
            logEntry.innerHTML = `
                <span class="log-time">[${timestamp}]</span> 
                <span class="log-step">${message}</span>
            `;
        }
        
        this.attackLog.appendChild(logEntry);
        this.attackLog.scrollTop = this.attackLog.scrollHeight;
    }
    
    clearLog() {
        this.attackLog.innerHTML = '';
    }
    
    showCompletion() {
        this.statusDisplay.style.display = 'block';
        this.statusMessage.textContent = '🚨 Account Compromised!';
        this.addLogEntry('🚨 Account Compromised - Simulation Complete');
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
    
    resetSimulation() {
        this.isRunning = false;
        this.currentStep = 0;
        this.attacks = [];
        this.interactiveStepResolver = null;
        
        // Reset UI
        this.startBtn.disabled = false;
        this.resetBtn.style.display = 'none';
        this.currentStepDiv.style.display = 'block';
        this.currentStepDiv.textContent = 'Click "Start Attack Simulation" to begin';
        this.credentialForm.style.display = 'none';
        this.statusDisplay.style.display = 'none';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0%';
        
        // Clear form
        this.loginForm.reset();
        
        // Clear log and add ready message
        this.clearLog();
        this.addLogEntry('System ready. Waiting for simulation to start...');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new AttackSimulator();
    
    // Add some helpful console messages
    console.log('MITRE ATT&CK Compromise Accounts Simulation loaded');
    console.log('Techniques used:');
    console.log('- T1566: Phishing');
    console.log('- T1003: Credential Access');
    console.log('- T1078: Valid Accounts');
});

// Global function for tab switching (used in HTML onclick)
function switchToTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Get tab elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab contents:', tabContents.length);
    
    // Remove active class from all tabs and contents
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(tabName);
    
    console.log('Selected button:', selectedButton);
    console.log('Selected content:', selectedContent);
    
    if (selectedButton && selectedContent) {
        selectedButton.classList.add('active');
        selectedContent.classList.add('active');
        console.log('Tab switched successfully to:', tabName);
    } else {
        console.error('Could not find tab elements for:', tabName);
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const startBtn = document.getElementById('startBtn');
        if (!startBtn.disabled) {
            startBtn.click();
        }
    } else if (e.key === 'Escape' || e.key === 'r') {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn.style.display !== 'none') {
            resetBtn.click();
        }
    }
});