export class UserError extends Error {
  debugInfo: unknown;

  constructor(text: string, debugInfo?: unknown) {
    super(text);
    this.debugInfo = debugInfo;
  }

  static assert(
    condition: unknown,
    text: string,
    debugInfo?: unknown
  ): asserts condition {
    if (!condition) {
      throw new UserError(text, debugInfo);
    }
  }
}
