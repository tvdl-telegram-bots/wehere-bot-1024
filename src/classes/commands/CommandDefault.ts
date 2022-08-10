import { assert } from "console";
import { ChatResponse, Command, CommandContext } from "../../types";
import { expectNonEmptyString } from "../../utils/assert";
import {
  EMOJI_ANGEL,
  EMOJI_INBOX,
  EMOJI_MORTAL,
  EMOJI_OUTBOX,
} from "../../utils/emojis";
import { Stateful } from "../Stateful";

export class CommandDefault implements Command {
  stateful: Stateful;

  constructor({ stateful }: { stateful: Stateful }) {
    this.stateful = stateful;
  }

  match(args: string[]) {
    return args[0] === "/default";
  }

  async handler({ args, fromUserId }: CommandContext): Promise<ChatResponse> {
    assert(args.length === 2);
    const content = expectNonEmptyString(args[1]);
    const role = await this.stateful.getRole({ userId: fromUserId });
    switch (role) {
      case "angel": {
        const angel = await this.stateful.getAngel({ userId: fromUserId });
        if (!angel || !angel.isOnline) {
          return {
            type: "reply",
            payload: `angel not online ${JSON.stringify({ angel })}`,
          };
        } else if (!angel.replyingTo) {
          return {
            type: "reply",
            payload: `angel not replying to anyone ${JSON.stringify({
              angel,
            })}`,
          };
        } else {
          await this.stateful.addMessage({
            timestamp: Date.now(),
            fromUserId: null,
            toUserId: angel.replyingTo,
            text: content,
          });

          const onlineAngels = await this.stateful.getOnlineAngels();
          return {
            type: "block",
            payload: [
              {
                type: "send",
                payload: { toUserId: angel.replyingTo, text: content },
              },
              ...onlineAngels.map((otherAngel): ChatResponse => {
                if (!otherAngel.isOnline) {
                  return { type: "noop" };
                } else {
                  return {
                    type: "send",
                    payload: {
                      toUserId: otherAngel.userId,
                      text: `[${angel.replyingTo}] ${EMOJI_ANGEL}: ${content}`,
                    },
                  };
                }
              }),
            ],
          };
        }
      }
      case "mortal": {
        await this.stateful.addMessage({
          timestamp: Date.now(),
          fromUserId: fromUserId,
          toUserId: null,
          text: content,
        });

        const onlineAngels = await this.stateful.getOnlineAngels();

        return {
          type: "block",
          payload: onlineAngels.map((angel): ChatResponse => {
            if (!angel.isOnline) {
              return { type: "noop" };
            } else {
              return {
                type: "send",
                payload: {
                  toUserId: angel.userId,
                  text: `[${fromUserId}] ${EMOJI_MORTAL}: ${content}`,
                },
              };
            }
          }),
        };
      }
    }
  }
}
