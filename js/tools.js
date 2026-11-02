// Name: Ahmad Salahuddin bin Mazlan | Matric: DX242569SPDJ04
// All four tools run with plain JavaScript in a static website.

// Read a number only when the input is not blank and is a finite value.
function readNumber(id, min = -Infinity) {
  const input = document.getElementById(id);
  if (!input || input.value.trim() === '') return null;
  const number = Number(input.value);
  return Number.isFinite(number) && number >= min ? number : null;
}

function formatNumber(number, decimals = 8) {
  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: decimals
  }).format(number);
}

function showResult(id, label, main, detail = '', isError = false) {
  const output = document.getElementById(id);
  if (!output) return;
  output.classList.toggle('result-error', isError);
  output.replaceChildren(); // textContent below is safe for user-supplied values
  const smallLabel = document.createElement('span');
  smallLabel.textContent = label;
  const strong = document.createElement('strong');
  strong.textContent = main;
  const smaller = document.createElement('small');
  smaller.textContent = detail;
  output.append(smallLabel, strong, smaller);
}

// Tool 1: basic four-operation calculator (Lab Skill 3).
const calcButtons = document.querySelectorAll('[data-calc]');
calcButtons.forEach(button => button.addEventListener('click', () => {
  const a = readNumber('calcA');
  const b = readNumber('calcB');
  if (a === null || b === null) {
    showResult('calcResult', 'RESULT', 'Invalid input', 'Please enter two valid numbers.', true);
    return;
  }
  let result;
  let symbol;
  switch (button.dataset.calc) {
    case 'add': result = a + b; symbol = '+'; break;
    case 'subtract': result = a - b; symbol = '-'; break;
    case 'multiply': result = a * b; symbol = '×'; break;
    case 'divide':
      if (b === 0) {
        showResult('calcResult', 'RESULT', 'Cannot divide by zero', 'Enter a non-zero second number.', true);
        return;
      }
      result = a / b; symbol = '÷'; break;
    default: return;
  }
  if (!Number.isFinite(result)) {
    showResult('calcResult', 'RESULT', 'Result too large', 'Try smaller numbers.', true);
    return;
  }
  showResult('calcResult', 'RESULT', formatNumber(result),
    `${formatNumber(a)} ${symbol} ${formatNumber(b)}`);
}));
const calcClear = document.getElementById('calcClear');
if (calcClear) calcClear.addEventListener('click', () => {
  document.getElementById('calcA').value = '';
  document.getElementById('calcB').value = '';
  showResult('calcResult', 'RESULT', 'Ready to calculate', 'The answer will appear here.');
});

// Tool 2: adult BMI checker.
const bmiForm = document.getElementById('bmiForm');
if (bmiForm) {
  bmiForm.addEventListener('submit', event => {
    event.preventDefault();
    const weight = readNumber('bmiWeight', Number.MIN_VALUE);
    const height = readNumber('bmiHeight', Number.MIN_VALUE);
    if (weight === null || height === null || weight <= 0 || height <= 0) {
      showResult('bmiResult', 'YOUR BODY MASS INDEX', 'Invalid measurements',
        'Enter a weight and height greater than zero.', true);
      return;
    }
    const bmi = weight / ((height / 100) ** 2);
    if (!Number.isFinite(bmi)) {
      showResult('bmiResult', 'YOUR BODY MASS INDEX', 'Invalid measurements', 'Use reasonable positive values.', true);
      return;
    }
    const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal range' :
      bmi < 30 ? 'Overweight' : 'Obesity';
    showResult('bmiResult', 'YOUR BODY MASS INDEX', bmi.toFixed(1), `Adult BMI category: ${category}`);
  });
  bmiForm.addEventListener('reset', () => {
    showResult('bmiResult', 'YOUR BODY MASS INDEX', 'Waiting for input', 'Enter your measurements to see your BMI.');
  });
}

// Tool 3: progressive income tax table reused from Lab Skill 3.
// Format: [upper chargeable-income bound, marginal tax rate].
// This is coursework data, not a representation of current LHDN rules.
const TAX_BANDS = [
  [5000, 0], [20000, 0.01], [35000, 0.03], [50000, 0.08],
  [70000, 0.13], [100000, 0.21], [250000, 0.24],
  [400000, 0.245], [600000, 0.25], [1000000, 0.26],
  [2000000, 0.28], [Infinity, 0.30]
];
function calculateTax(income) {
  let total = 0;
  let previous = 0;
  for (const [limit, rate] of TAX_BANDS) {
    const taxablePart = Math.max(0, Math.min(income, limit) - previous);
    total += taxablePart * rate;
    previous = limit;
    if (income <= limit) break;
  }
  return total;
}
const taxForm = document.getElementById('taxForm');
if (taxForm) {
  taxForm.addEventListener('submit', event => {
    event.preventDefault();
    const income = readNumber('taxIncome', 0);
    const breakdown = document.getElementById('taxBreakdown');
    if (income === null) {
      breakdown.hidden = true;
      showResult('taxResult', 'ESTIMATED INCOME TAX', 'Invalid income',
        'Enter a valid non-negative annual chargeable income.', true);
      return;
    }
    const amount = calculateTax(income);
    showResult('taxResult', 'ESTIMATED INCOME TAX',
      `RM ${amount.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      `Annual chargeable income: RM ${formatNumber(income, 2)}`);
    breakdown.hidden = false;
    breakdown.textContent = `Effective tax rate: ${income === 0 ? '0.00' : (amount / income * 100).toFixed(2)}% of chargeable income.`;
  });
  taxForm.addEventListener('reset', () => {
    document.getElementById('taxBreakdown').hidden = true;
    showResult('taxResult', 'ESTIMATED INCOME TAX', 'Waiting for input', 'The annual tax amount will appear here.');
  });
}

// Tool 4: exactly one number input, four conversion buttons and one result paragraph.
const conversionTypes = {
  'cm-m': {factor: 0.01, from: 'cm', to: 'm'},
  'm-cm': {factor: 100, from: 'm', to: 'cm'},
  'm-km': {factor: 0.001, from: 'm', to: 'km'},
  'km-m': {factor: 1000, from: 'km', to: 'm'}
};
document.querySelectorAll('[data-convert]').forEach(button => {
  button.addEventListener('click', () => {
    const input = readNumber('unitValue');
    if (input === null) {
      showResult('unitResult', 'CONVERSION RESULT', 'Invalid input',
        'Please enter a valid number.', true);
      return;
    }
    const conversion = conversionTypes[button.dataset.convert];
    if (!conversion) return;
    const output = input * conversion.factor;
    if (!Number.isFinite(output)) {
      showResult('unitResult', 'CONVERSION RESULT', 'Result too large', 'Try a smaller number.', true);
      return;
    }
    showResult('unitResult', 'CONVERSION RESULT',
      `${formatNumber(output, 10)} ${conversion.to}`,
      `${formatNumber(input, 10)} ${conversion.from} = ${formatNumber(output, 10)} ${conversion.to}`);
  });
});
const unitClear = document.getElementById('unitClear');
if (unitClear) unitClear.addEventListener('click', () => {
  document.getElementById('unitValue').value = '';
  showResult('unitResult', 'CONVERSION RESULT', 'Choose a conversion', 'Your converted value will appear here.');
});
