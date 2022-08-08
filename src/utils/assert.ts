export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function expectString(value: any): string {
  if (typeof value === "string") return value;
  throw new TypeError(`value must be a string ${JSON.stringify({ value })}`);
}

export function expectNonEmptyString(value: any): string {
  if (typeof value === "string" && value) return value;
  throw new TypeError(
    `value must be a non-empty string ${JSON.stringify({ value })}`
  );
}

export function expectInteger(value: any): number {
  switch (typeof value) {
    case "number": {
      if (Number.isInteger(value)) return value;
      break;
    }
    case "string": {
      const number = value == null ? null : parseInt(value, 10);
      if (number != null && !isNaN(number)) return number;
      break;
    }
  }
  throw new TypeError(`value must be an integer ${JSON.stringify({ value })}`);
}
