const previousElementValue = document.querySelector(".previous");
const currentElementValue = document.querySelector(".current");
const number = document.querySelectorAll(".number");
const operation = document.querySelectorAll(".operation");
const del = document.querySelector(".del");
const equal = document.querySelector(".equal");

const calc = {
  currentValue: "",
  previousValue: "",
  operand: "",
  pressEqual: false,

  compute: function (current, prev) {
    switch (this.operand) {
      case "+":
        console.log(prev, current);
        return +prev + +current;
      case "-":
        console.log(+prev, +current);
        return +prev - +current;
      case "×":
        console.log(+prev * +current);
        return +prev * +current;
      case "÷":
        console.log(+prev / +current);
        return +prev / +current;
    }
  },

  setOperation: function (operand) {
    if (this.currentValue === "" && this.operand === "") return;

    if (this.previousValue === "") {
      this.previousValue = this.currentValue;
    }

    if (this.operand === "") {
      this.operand = operand.textContent;
    } else {
      this.previousValue = this.compute(
        this.currentValue,
        this.previousValue
      ).toString();
      this.operand = operand.textContent;
    }

    this.currentValue = "";
  },

  del: function () {
    if (this.currentValue === "") {
      if (this.operand !== "") {
        this.operand = "";
      } else {
        this.previousValue = this.previousValue.slice(0, -1);
      }
    }
    this.currentValue = this.currentValue.slice(0, -1);
  },

  equal: function () {
    if (this.currentValue === "" || this.previousValue === "") return;
    this.currentValue = this.compute(this.currentValue, this.previousValue);

    this.operand = "";
    this.previousValue = "";
    this.pressEqual = true;
  },

  display: function () {
    if (this.pressEqual) {
      currentElementValue.textContent = this.currentValue;
      this.currentValue = "";
      this.pressEqual = false;
    } else {
      currentElementValue.textContent = this.currentValue;
    }
    previousElementValue.textContent = this.previousValue + this.operand;

    if (
      this.currentValue === "0" &&
      this.previousValue === "" &&
      this.operand === ""
    ) {
      this.currentValue = "";
    }
  },
};

number.forEach((num) => {
  num.addEventListener("click", () => {
    calc.currentValue += num.textContent;
    calc.display();
  });
});

operation.forEach((operand) => {
  operand.addEventListener("click", () => {
    calc.setOperation(operand);
    calc.display();
  });
});

del.addEventListener("click", () => {
  calc.del();
  calc.display();
});

equal.addEventListener("click", () => {
  calc.equal();
  calc.display();
});
