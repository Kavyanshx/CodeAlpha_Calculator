// Calculator logic (app.js)
// Features:
//  - basic arithmetic (+ - * /)
//  - percent, clear, delete
//  - keyboard support
//  - decimal handling and simple error state

const display = document.getElementById('display');
let current = '';
let previous = '';
let operator = null;
let resetNext = false;

function updateDisplay() {
  display.textContent = current || '0';
}

// helpers
function appendNumber(num) {
  if (resetNext) {
    current = '';
    resetNext = false;
  }
  if (num === '.' && current.includes('.')) return;
  // avoid leading zeros like "00"
  if (current === '0' && num !== '.') current = num;
  else current = current + num;
}

function chooseOperator(op) {
  if (current === '') return;
  if (previous !== '') compute();
  operator = op;
  previous = current;
  resetNext = true;
}

function compute() {
  if (!operator || previous === '') return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      result = (b === 0) ? 'Error' : a / b;
      break;
    default: return;
  }
  // Format result: trim long floats
  if (result !== 'Error' && typeof result === 'number') {
    // round to 10 decimal places max to avoid JS float noise
    result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
    // if integer, show without decimal
    if (Number.isInteger(result)) result = result.toString();
    else result = result.toString();
  } else {
    result = String(result);
  }

  current = result;
  operator = null;
  previous = '';
  resetNext = true;
}

function clearAll() {
  current = '';
  previous = '';
  operator = null;
  resetNext = false;
}

function deleteDigit() {
  if (resetNext) { current = ''; resetNext = false; updateDisplay(); return; }
  current = current.slice(0, -1);
}

function percent() {
  if (!current) return;
  const val = parseFloat(current);
  if (isNaN(val)) return;
  current = String(val / 100);
}

// Event handling (mouse / touch)
document.addEventListener('click', (e) => {
  const numBtn = e.target.closest('[data-number]');
  const actionBtn = e.target.closest('[data-action]');

  if (numBtn) {
    appendNumber(numBtn.textContent.trim());
    updateDisplay();
    return;
  }
  if (actionBtn) {
    const act = actionBtn.getAttribute('data-action');
    if (act === 'clear') { clearAll(); updateDisplay(); return; }
    if (act === 'delete') { deleteDigit(); updateDisplay(); return; }
    if (act === 'percent') { percent(); updateDisplay(); return; }
    if (act === 'equals') { compute(); updateDisplay(); return; }
    if (act === 'add') chooseOperator('+');
    if (act === 'subtract') chooseOperator('-');
    if (act === 'multiply') chooseOperator('*');
    if (act === 'divide') chooseOperator('/');
    updateDisplay();
  }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if ((/^\d$/).test(e.key)) {
    appendNumber(e.key);
    updateDisplay();
  } else if (e.key === '.') {
    appendNumber('.');
    updateDisplay();
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    compute();
    updateDisplay();
  } else if (e.key === 'Backspace') {
    deleteDigit();
    updateDisplay();
  } else if (e.key === 'Escape') {
    clearAll();
    updateDisplay();
  } else if (e.key === '+') {
    chooseOperator('+');
  } else if (e.key === '-') {
    chooseOperator('-');
  } else if (e.key === '*') {
    chooseOperator('*');
  } else if (e.key === '/') {
    chooseOperator('/');
  } else if (e.key === '%') {
    percent();
    updateDisplay();
  }
});

// initialize
clearAll();
updateDisplay();
