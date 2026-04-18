/**
 * Convert a number to its word representation
 * Useful for financial documents (receipts, checks, invoices)
 * 
 * Examples:
 * - 100 → "One Hundred"
 * - 1500 → "One Thousand Five Hundred"
 * - 2500.50 → "Two Thousand Five Hundred and 50/100"
 */

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];

const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const scales = [
  "",
  "Thousand",
  "Million",
  "Billion",
  "Trillion",
];

/**
 * Convert a number less than 1000 to words
 * @param {number} num - Number between 0 and 999
 * @returns {string} Word representation
 */
function convertHundreds(num) {
  let result = "";

  // Handle hundreds place
  const hundreds = Math.floor(num / 100);
  if (hundreds > 0) {
    result += ones[hundreds] + " Hundred";
  }

  // Handle tens and ones place
  const remainder = num % 100;
  if (remainder > 0) {
    if (result) result += " ";

    if (remainder < 10) {
      result += ones[remainder];
    } else if (remainder < 20) {
      result += teens[remainder - 10];
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;
      result += tens[tensDigit];
      if (onesDigit > 0) {
        result += " " + ones[onesDigit];
      }
    }
  }

  return result;
}

/**
 * Convert an integer to words
 * @param {number} num - Integer to convert
 * @returns {string} Word representation
 */
function convertInteger(num) {
  // Handle zero
  if (num === 0) return "Zero";

  // Handle negative
  const isNegative = num < 0;
  num = Math.abs(num);

  // Break number into groups of three
  const groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  // Convert each group and add scale
  const words = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) {
      const groupWords = convertHundreds(groups[i]);
      const scale = scales[i];
      words.push(scale ? `${groupWords} ${scale}` : groupWords);
    }
  }

  let result = words.join(" ");
  if (isNegative) {
    result = "Negative " + result;
  }

  return result;
}

/**
 * Convert a monetary amount to words
 * @param {number} amount - Amount to convert (e.g., 2500.50)
 * @param {string} currency - Currency name (default: "Shillings")
 * @param {string} fraction - Fraction unit name (default: "Cents")
 * @returns {string} Amount in words format
 */
export function amountInWords(amount, currency = "Shillings", fraction = "Cents") {
  // Handle edge cases
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Zero";
  }

  // Convert to number if string
  amount = Number(amount);

  // Handle zero
  if (amount === 0) {
    return "Zero";
  }

  // Split into whole and decimal parts
  const parts = amount.toString().split(".");
  const wholePart = parseInt(parts[0]) || 0;
  const decimalPart = parseInt((parts[1] || "0").padEnd(2, "0").substring(0, 2));

  // Convert whole part to words
  let result = convertInteger(wholePart);

  // Add fraction part if present
  if (decimalPart > 0) {
    result += ` and ${decimalPart}/${100}`;
  }

  // Add currency name if provided
  if (currency) {
    result += ` ${currency}`;
  }

  return result;
}

/**
 * Format amount as it would appear on a check or financial document
 * @param {number} amount - Amount to format
 * @param {string} currencySymbol - Currency symbol (default: "KES")
 * @returns {string} Formatted amount in words with value
 */
export function formatCheckAmount(amount, currencySymbol = "KES") {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Zero";
  }

  amount = Number(amount);
  const words = amountInWords(amount, "Only");
  const numeric = amount.toLocaleString("en-KE", {
    style: "currency",
    currency: currencySymbol,
    minimumFractionDigits: 2,
  });

  return `${words} (${numeric})`;
}

/**
 * Simple number to words (without currency)
 * @param {number} num - Number to convert
 * @returns {string} Word representation
 */
export function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return "Zero";
  }

  return convertInteger(Number(num));
}

/**
 * Convert amount to short format for receipts
 * Example: 2500.50 → "Two Thousand Five Hundred and 50/100"
 * @param {number} amount - Amount to convert
 * @returns {string} Short format
 */
export function amountInWordsShort(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Zero";
  }

  amount = Number(amount);

  // Split into whole and decimal parts
  const parts = amount.toString().split(".");
  const wholePart = parseInt(parts[0]) || 0;
  const decimalPart = parseInt((parts[1] || "0").padEnd(2, "0").substring(0, 2));

  // Convert whole part to words
  let result = convertInteger(wholePart);

  // Add fraction part if present
  if (decimalPart > 0) {
    result += ` and ${decimalPart}/100`;
  }

  return result;
}

/**
 * Localized version for Kenyan Shillings
 * @param {number} amount - Amount in KES
 * @returns {string} Amount in words with Shillings/Cents
 */
export function amountInKES(amount) {
  return amountInWords(amount, "Shillings", "Cents");
}
