class ContentSlider {
    constructor(sliderId) {
        this.slider = document.getElementById(sliderId);
        if (!this.slider) return;

        this.slides = this.slider.querySelectorAll('.slide');
        this.dotsContainer = document.getElementById(`${sliderId}Dots`);
        this.currentIndex = 0;

        this.createDots();
        this.showSlide(0);
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';

        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.addEventListener('click', () => this.showSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    showSlide(index) {
        if (!this.slides.length) return;

        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        this.slides.forEach((slide) => slide.classList.remove('active'));

        const dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.slider-dot') : [];
        dots.forEach((dot) => dot.classList.remove('active'));

        this.slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        this.currentIndex = index;
    }

    nextSlide() {
        this.showSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.showSlide(this.currentIndex - 1);
    }
}

class AttackSimulator {
    constructor() {
        this.attacks = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.stepDelay = 2000;
        this.interactiveStepResolver = null;
        this.sliders = {};

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
        this.initializeSliders();
    }

    initializeSliders() {
        this.sliders.homeInfoSlider = new ContentSlider('homeInfoSlider');
        this.sliders.defenseSlider = new ContentSlider('defenseSlider');

        document.querySelectorAll('.prev-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const sliderName = button.getAttribute('data-slider');
                if (this.sliders[sliderName]) {
                    this.sliders[sliderName].prevSlide();
                }
            });
        });

        document.querySelectorAll('.next-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const sliderName = button.getAttribute('data-slider');
                if (this.sliders[sliderName]) {
                    this.sliders[sliderName].nextSlide();
                }
            });
        });
    }

    initializeTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');

        tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach((button) => button.classList.remove('active'));
        tabContents.forEach((content) => content.classList.remove('active'));

        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);

        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
        }
    }

    initializeEventListeners() {
        if (this.startBtn) this.startBtn.addEventListener('click', () => this.startSimulation());
        if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetSimulation());
        if (this.loginForm) this.loginForm.addEventListener('submit', (e) => this.handleCredentialSubmit(e));
        if (this.clearLogBtn) this.clearLogBtn.addEventListener('click', () => this.handleClearLog());
    }

    async startSimulation() {
        if (this.isRunning) return;

        try {
            this.startBtn.disabled = true;
            this.resetBtn.style.display = 'inline-block';
            this.isRunning = true;
            this.statusDisplay.style.display = 'none';

            this.attackLog.innerHTML = '';
            this.addLogEntry('Simulation started...');
            this.addLogEntry('Fetching attack steps from server...');

            const response = await fetch('/attack');
            if (!response.ok) {
                throw new Error('Failed to fetch attack data');
            }

            this.attacks = await response.json();
            this.addLogEntry(`Loaded ${this.attacks.length} attack steps`);

            await this.runSimulation();
        } catch (error) {
            console.error(error);
            this.addLogEntry(`Error: ${error.message}`);
            this.resetSimulation();
        }
    }

    async runSimulation() {
        for (let i = 0; i < this.attacks.length; i++) {
            if (!this.isRunning) break;

            this.currentStep = i;
            const attack = this.attacks[i];

            this.updateProgress(i + 1, this.attacks.length);
            this.displayStep(attack);
            this.addLogEntry(`${attack.step} → ${attack.mitre}`);

            if (attack.requires_input) {
                await this.handleInteractiveStep(attack);
            } else if (i < this.attacks.length - 1) {
                await this.delay(this.stepDelay);
            }
        }

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
        this.currentStepDiv.style.display = 'flex';
    }

    async handleInteractiveStep(attack) {
        return new Promise((resolve) => {
            this.interactiveStepResolver = resolve;

            this.currentStepDiv.style.display = 'none';
            this.credentialForm.style.display = 'block';

            if (attack.instruction) {
                this.formInstruction.textContent = attack.instruction;
            }

            this.addLogEntry('Waiting for user credential input...');

            setTimeout(() => {
                this.usernameInput.focus();
            }, 250);
        });
    }

    handleCredentialSubmit(event) {
        event.preventDefault();

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!username || !password) {
            this.addLogEntry('Please enter both username and password');
            return;
        }

        this.addLogEntry(`Credentials submitted: ${username} → ${'*'.repeat(password.length)}`);

        this.credentialForm.style.display = 'none';
        this.currentStepDiv.style.display = 'flex';
        this.loginForm.reset();

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

    handleClearLog() {
        this.attackLog.innerHTML = '';
        this.addLogEntry('Log cleared');
    }

    addLogEntry(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';

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

    showCompletion() {
        this.statusDisplay.style.display = 'block';
        this.statusMessage.textContent = '🚨 Account Compromised! Simulation complete.';
        this.addLogEntry('Account compromised - simulation complete');
        this.isRunning = false;
        this.startBtn.disabled = false;
    }

    resetSimulation() {
        this.isRunning = false;
        this.currentStep = 0;
        this.attacks = [];
        this.interactiveStepResolver = null;

        this.startBtn.disabled = false;
        this.resetBtn.style.display = 'none';
        this.currentStepDiv.style.display = 'flex';
        this.currentStepDiv.innerHTML = 'Click “Start Simulation” to begin the cybersecurity demonstration.';
        this.credentialForm.style.display = 'none';
        this.statusDisplay.style.display = 'none';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '0%';
        this.loginForm.reset();

        this.attackLog.innerHTML = '';
        this.addLogEntry('System ready. Waiting for simulation to start...');
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new AttackSimulator();
});

function switchToTab(tabName) {
    if (window.simulator) {
        window.simulator.switchTab(tabName);
    }
}

document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea';

    if (!isTyping && (e.key === 'Enter' || e.key === ' ')) {
        const startBtn = document.getElementById('startBtn');
        if (startBtn && !startBtn.disabled) {
            startBtn.click();
        }
    }

    if (!isTyping && (e.key === 'Escape' || e.key.toLowerCase() === 'r')) {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn && resetBtn.style.display !== 'none') {
            resetBtn.click();
        }
    }
});