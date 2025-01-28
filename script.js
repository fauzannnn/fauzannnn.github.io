class Calculator {
    constructor() {
        this.display = document.querySelector('.display');
        this.numberDisplay = document.querySelector('.current-number');
        this.operatorDisplay = document.querySelector('.operator-indicator');
        this.modal = document.querySelector('.modal');
        this.init();
    }

    init() {
        this.currentNumber = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButton(e.target));
        });

        document.getElementById('modal-yes').addEventListener('click', () => this.handleConfirmation(true));
        document.getElementById('modal-no').addEventListener('click', () => this.handleConfirmation(false));
    }

    handleButton(button) {
        const type = button.classList[1];
        
        switch(type) {
            case 'number':
                this.handleNumber(button.textContent);
                break;
            case 'operator':
                this.handleOperator(button.textContent);
                break;
            case 'clear':
                this.showConfirmation('clear');
                break;
            case 'equals':
                this.showConfirmation('calculate');
                break;
            case 'decimal':
                this.addDecimal();
                break;
        }
    }

    handleNumber(num) {
        if(this.waitingForSecondOperand) {
            this.currentNumber = num;
            this.waitingForSecondOperand = false;
        } else {
            this.currentNumber = this.currentNumber === '0' ? num : this.currentNumber + num;
        }
        this.updateDisplay();
    }

    handleOperator(operator) {
        const inputValue = parseFloat(this.currentNumber);
        
        if(this.operator && this.waitingForSecondOperand) {
            this.operator = operator;
            this.updateOperatorDisplay(operator);
            return;
        }
        
        if(this.firstOperand === null) {
            this.firstOperand = inputValue;
        } else if(this.operator) {
            const result = this.calculate(this.firstOperand, inputValue);
            this.currentNumber = `${result}`;
            this.firstOperand = result;
            this.updateDisplay();
        }
        
        this.operator = operator;
        this.waitingForSecondOperand = true;
        this.updateOperatorDisplay(operator);
    }

    calculate(first, second) {
        switch(this.operator) {
            case '+': return first + second;
            case '-': return first - second;
            case '×': return first * second;
            case '÷':
                if(second === 0) {
                    this.showError('Tidak bisa dibagi 0');
                    return 0;
                }
                return first / second;
            default: return second;
        }
    }

    addDecimal() {
        if(!this.currentNumber.includes('.')) {
            this.currentNumber += '.';
            this.updateDisplay();
        }
    }

    showConfirmation(action) {
        this.pendingAction = action;
        const message = action === 'clear' 
            ? 'Yakin ingin menghapus semua?' 
            : 'Yakin ingin menghitung hasil?';
        document.getElementById('modal-text').textContent = message;
        this.modal.style.display = 'flex';
    }

    handleConfirmation(confirmed) {
        this.modal.style.display = 'none';
        
        if(confirmed) {
            if(this.pendingAction === 'clear') {
                this.clearAll();
            } else {
                this.performCalculation();
            }
        }
        
        this.pendingAction = null;
    }

    performCalculation() {
        if(!this.operator) return;
        
        const inputValue = parseFloat(this.currentNumber);
        const result = this.calculate(this.firstOperand, inputValue);
        
        this.currentNumber = `${result}`;
        this.operator = null;
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.updateOperatorDisplay('');
        this.updateDisplay();
    }

    clearAll() {
        this.currentNumber = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.updateOperatorDisplay('');
        this.updateDisplay();
    }

    showError(message) {
        this.numberDisplay.textContent = message;
        this.display.classList.add('error');
        setTimeout(() => {
            this.clearAll();
            this.display.classList.remove('error');
        }, 1500);
    }

    updateDisplay() {
        const num = parseFloat(this.currentNumber);
        
        if(isNaN(num)) {
            this.numberDisplay.textContent = '0';
            return;
        }
        
        if(this.currentNumber.length > 12) {
            this.numberDisplay.textContent = num.toExponential(5);
        } else {
            this.numberDisplay.textContent = num.toLocaleString('en-US', {
                maximumFractionDigits: 7
            });
        }
    }

    updateOperatorDisplay(operator) {
        this.operatorDisplay.textContent = operator;
    }
}

// Initialize calculator
new Calculator();