const formElement = document.getElementById("app-form");
const billInput = document.getElementById("bill-input");
const billInputDisplay = document.getElementById("bill-form-group-inputs");
const billErrorMessage = document.getElementById("bill-error");
const customTipInput = document.getElementById("custom-tip");
const customTipDisplay = document.getElementById("custom-display");
const customTipErrorMessage = document.getElementById("custom-tip-error");
const peopleInput = document.getElementById("people-input");
const peopleInputDisplay = document.getElementById("people-form-group-inputs");
const peopleErrorMessage = document.getElementById("people-error");
const resetButton = document.getElementById("reset-btn");
const tipAmountDisplay = document.getElementById("calculation-tip-amount");
const totalAmountDisplay = document.getElementById("calculation-total-amount");
const radioButtons = document.querySelectorAll('input[name="tip-selection"]');
const initialSelectedRadio = document.querySelector(
  'input[name="tip-selection"]:checked'
);

// Initial values
let billValue = 0;
let tipPercentage = parseInput(initialSelectedRadio.value);
let tipTotal = 0;
let numPeople = 0;
let totalPerPerson = 0;

/**
 * Handler function for the bill input.
 * Sets billValue to a Number representation of the bill input.
 */
function handleBillInput() {
  const input = this.value;
  if (input === "") {
    if (!billErrorMessage.classList.contains("hidden")) {
      clearErrors(billErrorMessage, "hidden");
    }
    if (billInputDisplay.classList.contains("error-state")) {
      clearErrors(billInputDisplay, "error-state");
    }
    return;
  }
  if (input <= 0) {
    showErrors(billInputDisplay, "error-state");
    showErrors(billErrorMessage, "show");
    return;
  } else {
    if (!billErrorMessage.classList.contains("hidden")) {
      clearErrors(billErrorMessage, "hidden");
    }
    if (billInputDisplay.classList.contains("error-state")) {
      clearErrors(billInputDisplay, "error-state");
    }
    billValue = parseInput(input);
    calculateBill();
  }
}

/**
 * Handler function for radio button changes.
 * Sets tipPercentage to the Numeric value of the radio value.
 * Will toggle custom tip input visibility if needed.
 */
function handleRadioChange() {
  const input = parseInput(this.value);
  // Toggle custom tip input when custom is selected
  if (this.value === "custom") {
    customTipDisplay.classList.remove("hidden");
  } else {
    if (!customTipDisplay.classList.contains("hidden")) {
      customTipDisplay.classList.add("hidden");
    }
    tipPercentage = parseInput(input);
    calculateBill();
  }
}

/**
 * Handler function for the custom tip input.
 * Sets tipPercentage to the Numeric value of the input field.
 */
function handleCustomTipInput() {
  const input = parseInput(this.value);
  if (this.value === "") {
    if (!customTipErrorMessage.classList.contains("hidden")) {
      clearErrors(customTipErrorMessage, "hidden");
    }
    if (customTipInput.classList.contains("error-state")) {
      clearErrors(customTipInput, "error-state");
    }
    tipAmountDisplay.textContent = "$0";
    totalAmountDisplay.textContent = `$${parseInput(
      billValue / numPeople
    ).toFixed(2)}`;
    return;
  } else if (input <= 0) {
    showErrors(customTipInput, "error-state");
    showErrors(customTipErrorMessage, "show");
  } else {
    if (customTipInput.classList.contains("error-state")) {
      clearErrors(customTipInput, "error-state");
    }
    if (!customTipErrorMessage.classList.contains("hidden")) {
      clearErrors(customTipErrorMessage, "hidden");
    }
    tipPercentage = input / 100;
    calculateBill();
  }
}

/**
 * Handler function for number of people input.
 * Sets numPeople to the whole number value of the input field.
 */
function handlePeopleInput() {
  const input = parseInput(this.value);
  if (this.value === "") {
    clearErrors(peopleErrorMessage, "hidden");
    clearErrors(peopleInputDisplay, "error-state");
    tipAmountDisplay.textContent = "$0";
    totalAmountDisplay.textContent = "$0";
    numPeople = 0;
    return;
  } else if (input <= 0) {
    showErrors(peopleErrorMessage, "show");
    showErrors(peopleInputDisplay, "error-state");
    return;
  } else {
    if (!peopleErrorMessage.classList.contains("hidden")) {
      clearErrors(peopleErrorMessage, "hidden");
    }
    if (peopleInputDisplay.classList.contains("error-state")) {
      clearErrors(peopleInputDisplay, "error-state");
    }
    numPeople = input;
    calculateBill();
  }
}

/**
 * Handler function for the reset button.
 * Resets the form values to the default values and placeholders.
 * Clears any error states in the form.
 */
function handleReset() {
  // Remove error states and hide error messages
  clearErrors(billInputDisplay, "error-state");
  clearErrors(billErrorMessage, "hidden");
  clearErrors(customTipInput, "error-state");
  clearErrors(customTipErrorMessage, "hidden");
  clearErrors(peopleInputDisplay, "error-state");
  clearErrors(peopleErrorMessage, "hidden");

  // Reset hidden state on custom tip input
  customTipDisplay.classList.add("hidden");

  // Reset initial values and DOM total/tip values
  billValue = 0;
  tipPercentage = parseInput(initialSelectedRadio.value);
  tipTotal = 0;
  numPeople = 0;
  totalAmount = 0;
  tipAmountDisplay.textContent = "$0";
  totalAmountDisplay.textContent = "$0";

  formElement.reset();
}

/**
 * Handler function for refreshing page.
 * Resets the form and the default tip % radio button.
 */
function handleRefresh() {
  handleReset();
  const defaultRadio = document.getElementById("15-percent");
  defaultRadio.checked = true;
  tipPercentage = parseInput(defaultRadio.value);
}

/**
 * Parses string inputs from the input elements in the form.
 *
 * @param {String} input String representation of a number or float.
 * @return {Number} Number representation of the input.
 */
function parseInput(input) {
  return parseFloat(input);
}

/**
 * Helper function to clear error classes for a given element.
 *
 * @param {HTMLElement} element Element to clear errors from
 * @param {String} action "hidden" adds the 'hidden' class to the element. "error-state" removes the 'error-state' class from the element.
 */
function clearErrors(element, action) {
  if (action === "hidden") {
    element.classList.add("hidden");
  } else if (action === "error-state") {
    element.classList.remove("error-state");
  }
}

/**
 * Helper function to show error classes and messages for a given element.
 *
 * @param {HTMLElement} element Element to show errors on.
 * @param {String} action "show" removes the 'hidden' class from element. "error-state" adds the 'error-state' class to element.
 */
function showErrors(element, action) {
  if (action === "show") {
    element.classList.remove("hidden");
  } else if (action === "error-state") {
    element.classList.add("error-state");
  }
}

/**
 * Calculates the tip and total amounts per person.
 * Updates the DOM with tip and total amounts.
 * @return
 */
function calculateBill() {
  // Can only calculate if bill and people are greater than 0
  if (billValue <= 0 || numPeople <= 0) {
    return;
  }

  // Calculate total tip and tip per person
  let tipAmount = billValue * tipPercentage;
  tipTotal = tipAmount / numPeople;

  // Calculate total amount and amount per person
  let totalAmount = billValue + tipAmount;
  totalPerPerson = totalAmount / numPeople;

  // Update DOM
  tipAmountDisplay.textContent = `$${tipTotal.toFixed(2)}`;
  totalAmountDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;
}

// billInput.addEventListener("change", handleBillInput);
billInput.addEventListener("input", handleBillInput);
radioButtons.forEach((btn) => {
  btn.addEventListener("change", handleRadioChange);
});
customTipInput.addEventListener("input", handleCustomTipInput);
peopleInput.addEventListener("input", handlePeopleInput);
resetButton.addEventListener("click", handleReset);
window.addEventListener("pageshow", handleRefresh); // Reset when page is reloaded
