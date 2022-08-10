# wehere-bot-1024

👮 A Telegram bot for WeHere project 🧑

## Installing Dependencies

Make sure yarn is installed:

```sh
$ yarn --version
1.22.17
```

Then, install all the dependencies by:

```sh
$ yarn
Already up-to-date.
```

## Running the Bot

First, set up environment variables:

```
export TELEGRAM_BOT_TOKEN=0000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export NTBA_FIX_319=true
```

The token is generated from [BotFather](https://web.telegram.org/k/#@BotFather).

Then, start the bot

```
yarn start
```

# Role

Each user can be either Angel or Mortal. These are determined by a hard-coded list of user ids. User can override by running `/set role=mortal` or `/set role=angel`. Revert by running `/unset role`.

# State

For Angels, the possible states are: None, AttachedTo chatId

For Mortals, the possible states are: None
