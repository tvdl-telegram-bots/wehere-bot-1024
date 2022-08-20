import * as StringArgv from "string-argv";

export function parseArgs(message: string) {
  return StringArgv.parseArgsStringToArgv(message);
}

export function parseArgsCustomized(message: string) {
  if (message.startsWith("/__")) {
    const args = message.split("__");
    return args.slice(1);
  }
  if (message.startsWith("/")) {
    return StringArgv.parseArgsStringToArgv(message);
  }
  return ["/default", message];
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
