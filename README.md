# IDLESPLINTER FIXTHEMATCH MARKET

We're running a bot-as-a-service platform (http://idlesplinter.xyz) to help users earn passive income from [Splinterlands](https://steemmonsters.com?ref=olvaus). **IdlesplinterFTM** is a market that allows our user to sell/trade their Fled tokens to maximize their profit.

> Splinterlands (né SteemMonsters) is a multiplayer fantasy card game within which thousands of gamers battle every day. Full transparency of the blockchain's distributed ledger enables gamers to see how many of each different card exists in the entire game. Every card is individually owned, which means that even the creators of the game cannot take them away from any player, and all players are free to buy, sell, or trade them just like physical trading cards.

![idle](https://idlesplinter.xyz/bg.jpg "IDLESPLINTER")

## Fled token

Each **Fled token** has 2 properties:

- `account_name`: corresponding to Splinterlands accounts (which is currently Steem account)
- `match_type`: can be `rank` or `tournament`

Token owner can trade them freely on the [Stardust Marketplace](https://stardust.gg) or use them for their Splinterlands accounts. After using, the token will be burn and the bot will make sure the `account_name` account auto fled one `match_type` match against the user.

When the market launching, subscribers of our platform will be airdroped Fled token corresponding to their account(s). The buyer can be any Splinterlands player, who want to climb the leaderboard or win the tournaments.

## Demo

[Admin page](https://idlesplinter.xyz/@isftm_master/admin): create new user, add account to users.

[User page](https://idlesplinter.xyz/@olvaus): view and use token.

In demo, the `use` function is disabled.

## TODO

- Check authentication
- Update the UI for more game feel
- Add more type of token

## Setup

Clone project and install dependencies:

```
$ git clone https://github.com/bakaoh/ftm
$ cd ftm
$ npm install
```

Create master account and deploy game:

```
$ npm run setup
```

Check the newly created `.env` file, you will see something like this:

```
WEB_PORT=1911
SD_MASTER_NAME=isfmt_master_3025508406
SD_MASTER_PK=ed25519:46UqjK4A3CQeLGz9mWqp6uR3ofsVTMkbfSB8RuQX9NxtHqauQyeiiyxwUu1WQoGzaFJZ9K7315kFA46PmZf9K3eY
SD_GAME_ID=18
```

Run service:

```
$ npm run start
```

Or using PM2:

```
$ pm2 start ecosystem.config.js
```