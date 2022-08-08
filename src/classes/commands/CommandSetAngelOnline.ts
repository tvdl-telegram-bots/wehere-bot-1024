import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { Stateful } from "../Stateful";

export class CommandSetAngelOnline implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/set_angel_online";
  }

  async handler({
    args,
    chatId,
    fromUserId,
  }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 1);
    const update = { userId: fromUserId, chatId, isOnline: true };
    await this.stateful.setAngelOnlineStatus(update);
    return {
      type: "reply",
      payload: `angel set online ${JSON.stringify(update)}`,
    };
  }
}
