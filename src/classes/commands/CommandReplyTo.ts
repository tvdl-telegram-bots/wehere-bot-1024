import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { expectInteger } from "../../utils/assert";
import { Stateful } from "../Stateful";

export class CommandReplyTo implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/reply_to";
  }

  async handler({ args, fromUserId }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 2);
    const toUserId = expectInteger(args[1]);
    const angel = await this.stateful.getAngel({ userId: fromUserId });
    if (!angel || !angel.isOnline) {
      return {
        type: "reply",
        payload: `angel not online ${JSON.stringify(angel)}`,
      };
    }
    const update = {
      userId: angel.userId,
      replyingTo: toUserId,
    };
    await this.stateful.setAngelReplyingTo(update);
    return {
      type: "reply",
      payload: `set angel replying to ${JSON.stringify(update)}`,
    };
  }
}
