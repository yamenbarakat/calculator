const MAX_INPUT_LENGTH = 15;

class Calculator {
  constructor(previousElement, currentElement) {
    this.previousElement = previousElement;
    this.currentElement = currentElement;
    this.clear();
  }

  clear() {
    this.currentValue = "";
    this.previousValue = "";
    this.operation = "";
    this.justEvaluated = false;
    this.error = "";
    this.render();
  }

  appendNumber(input) {
    if (this.error) {
      this.clear();
    }

    if (this.justEvaluated && !this.operation) {
      this.currentValue = "";
      this.justEvaluated = false;
    }

    if (input === "." && this.currentValue.includes(".")) {
      return;
    }

    if (this.currentValue.length >= MAX_INPUT_LENGTH) {
      return;
    }

    if (input === "." && this.currentValue === "") {
      this.currentValue = "0";
    }

    this.currentValue += input;
    this.render();
  }

  setOperation(nextOperation) {
    if (this.error) {
      return;
    }

    if (this.currentValue === "" && this.previousValue === "") {
      return;
    }

    if (this.currentValue === "" && this.previousValue !== "") {
      this.operation = nextOperation;
      this.render();
      return;
    }

    if (this.previousValue !== "") {
      const result = this.compute();
      if (result === null) {
        return;
      }

      this.previousValue = this.normalizeNumber(result);
    } else {
      this.previousValue = this.currentValue;
    }

    this.currentValue = "";
    this.operation = nextOperation;
    this.justEvaluated = false;
    this.render();
  }

  deleteLast() {
    if (this.error) {
      this.clear();
      return;
    }

    if (this.justEvaluated) {
      this.currentValue = "";
      this.justEvaluated = false;
      this.render();
      return;
    }

    this.currentValue = this.currentValue.slice(0, -1);
    this.render();
  }

  evaluate() {
    if (this.error || !this.operation || this.currentValue === "" || this.previousValue === "") {
      return;
    }

    const result = this.compute();
    if (result === null) {
      return;
    }

    this.currentValue = this.normalizeNumber(result);
    this.previousValue = "";
    this.operation = "";
    this.justEvaluated = true;
    this.render();
  }

  compute() {
    const left = Number(this.previousValue);
    const right = Number(this.currentValue);

    if (Number.isNaN(left) || Number.isNaN(right)) {
      this.showError("Invalid input");
      return null;
    }

    switch (this.operation) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        if (right === 0) {
          this.showError("Cannot divide by zero");
          return null;
        }
        return left / right;
      default:
        return null;
    }
  }

  normalizeNumber(value) {
    const normalized = Number.parseFloat(value.toFixed(10));
    return normalized.toString();
  }

  showError(message) {
    this.error = message;
    this.currentElement.textContent = message;
    this.previousElement.textContent = "";
  }

  getOperationSymbol() {
    switch (this.operation) {
      case "*":
        return "\u00D7";
      case "/":
        return "\u00F7";
      default:
        return this.operation;
    }
  }

  render() {
    if (this.error) {
      return;
    }

    this.currentElement.textContent = this.currentValue || "0";
    this.previousElement.textContent = `${this.previousValue}${this.getOperationSymbol()}`;
  }
}

const previousElement = document.querySelector("[data-previous]");
const currentElement = document.querySelector("[data-current]");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");

const calculator = new Calculator(previousElement, currentElement);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => calculator.appendNumber(button.dataset.number));
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => calculator.setOperation(button.dataset.operation));
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { action } = button.dataset;

    if (action === "clear") {
      calculator.clear();
      return;
    }

    if (action === "delete") {
      calculator.deleteLast();
      return;
    }

    if (action === "equals") {
      calculator.evaluate();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if ((key >= "0" && key <= "9") || key === ".") {
    calculator.appendNumber(key);
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    calculator.setOperation(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculator.evaluate();
    return;
  }

  if (key === "Backspace") {
    calculator.deleteLast();
    return;
  }

  if (key === "Escape") {
    calculator.clear();
  }
});
