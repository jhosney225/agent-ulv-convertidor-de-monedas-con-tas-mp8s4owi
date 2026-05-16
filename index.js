
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

// Define tools for the currency converter
const tools = [
  {
    name: "get_exchange_rates",
    description:
      "Get current exchange rates for a specific base currency. Returns rates for major currencies.",
    input_schema: {
      type: "object",
      properties: {
        base_currency: {
          type: "string",
          description:
            "The base currency code (e.g., USD, EUR, GBP, JPY, MXN)",
        },
      },
      required: ["base_currency"],
    },
  },
  {
    name: "convert_currency",
    description:
      "Convert an amount from one currency to another using current exchange rates",
    input_schema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "The amount to convert",
        },
        from_currency: {
          type: "string",
          description: "The source currency code",
        },
        to_currency: {
          type: "string",
          description: "The target currency code",
        },
      },
      required: ["amount", "from_currency", "to_currency"],
    },
  },
  {
    name: "list_supported_currencies",
    description: "List all supported currencies for conversion",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// Simulated exchange rates (in a real app, these would come from an API)
const exchangeRates = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    MXN: 17.05,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    BRL: 4.97,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    JPY: 162.5,
    MXN: 18.55,
    CAD: 1.48,
    AUD: 1.65,
    CHF: 0.96,
    CNY: 7.88,
    INR: 90.35,
    BRL: 5.41,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    JPY: 189.0,
    MXN: 21.58,
    CAD: 1.72,
    AUD: 1.92,
    CHF: 1.12,
    CNY: 9.18,
    INR: 105.1,
    BRL: 6.3,
  },
  JPY: {
    USD: 0.0067,
    EUR: 0.0062,
    GBP: 0.0053,
    MXN: 0.114,
    CAD: 0.0091,
    AUD: 0.0102,
    CHF: 0.0059,
    CNY: 0.0485,
    INR: 0.557,
    BRL: 0.0334,
  },
  MXN: {
    USD: 0.0587,
    EUR: 0.0539,
    GBP: 0.0464,
    JPY: 8.78,
    CAD: 0.0798,
    AUD: 0.0892,
    CHF: 0.0516,
    CNY: 0.425,
    INR: 4.88,
    BRL: 0.292,
  },
  CAD: {
    USD: 0.735,
    EUR: 0.676,
    GBP: 0.581,
    JPY: 110.0,
    MXN: 12.54,
    AUD: 1.118,
    CHF: 0.648,
    CNY: 5.32,
    INR: 61.2,
    BRL: 3.66,
  },
  AUD: {
    USD: 0.658,
    EUR: 0.605,
    GBP: 0.521,
    JPY: 98.4,
    MXN: 11.22,
    CAD: 0.894,
    CHF: 0.58,
    CNY: 4.76,
    INR: 54.8,
    BRL: 3.27,
  },
  CHF: {
    USD: 1.136,
    EUR: 1.043,
    GBP: 0.893,
    JPY: 169.8,
    MXN: 19.37,
    CAD: 1.544,
    AUD: 1.724,
    CNY: 8.22,
    INR: 94.6,
    BRL: 5.64,
  },
  CNY: {
    USD: 0.138,
    EUR: 0.127,
    GBP: 0.109,
    JPY: 20.65,
    MXN: 2.36,
    CAD: 0.188,
    AUD: 0.21,
    CHF: 0.122,
    INR: 11.51,
    BRL: 0.687,
  },
  INR: {
    USD: 0.012,
    