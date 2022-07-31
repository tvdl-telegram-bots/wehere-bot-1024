export class Expect {
  static expectString(value: any): string {
    if (typeof value === "string") return value;
    throw new TypeError(`value must be a string ${JSON.stringify({ value })}`);
  }

  static expectInteger(value: any): number {
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
    throw new TypeError(
      `value must be an integer ${JSON.stringify({ value })}`
    );
  }

  // static async expectString(value: any) {
  //   if (typeof value === "string") {
  //     return value;
  //   } else {
  //     throw new TypeError(
  //       `value must be a string ${JSON.stringify({ value })}`
  //     );
  //   }
  // }
}
