import * as StringArgv from "string-argv";

export function parseArgs(message: string) {
  return StringArgv.parseArgsStringToArgv(message);
}
