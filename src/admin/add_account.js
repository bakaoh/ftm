const API = require("../stardust");
const gameId = parseInt(process.env.SD_GAME_ID);

const getRandomInt = (max = 10000000000) =>
  Math.floor(Math.random() * Math.floor(max));

const createRankedItem = async (accountId, userId) => {
  return API.setters.token.add({
    name: `${accountId.toUpperCase()} (Rank)`,
    desc: `${accountId} fled in ranked match`,
    image:
      "https://d36mxiodymuqjm.cloudfront.net/website/nav/icon_nav_battle_active@2x.png",
    cap: 0,
    rarity: 0, // Common
    value: 1,
    gameId,
    props: [
      { key: "uid", type: "string", value: userId },
      { key: "aid", type: "string", value: accountId },
      { key: "mid", type: "string", value: "rank" }
    ]
  });
};

const createTournamentItem = async (accountId, userId) => {
  return API.setters.token.add({
    name: `${accountId.toUpperCase()} (Tournament)`,
    desc: `${accountId} fled in tournament match`,
    image:
      "https://d36mxiodymuqjm.cloudfront.net/website/nav/icon_nav_events_active@2x.png",
    cap: 0,
    rarity: 1, // Rare
    value: 10,
    gameId,
    props: [
      { key: "uid", type: "string", value: userId },
      { key: "aid", type: "string", value: accountId },
      { key: "mid", type: "string", value: "tournament" }
    ]
  });
};

const giveItem = async ({ userId, items }) => {
  // Usage: {'userId': 'test_account', 'items': [{'id': 1, 'quantity': 2}, {'id': 2, 'quantity': 3}]}
  return await Promise.all(
    items.map(item => {
      const data = {
        userId,
        amount: item.quantity,
        tokenId: item.id
      };
      console.log(data);
      return API.setters.token.mint(data);
    })
  ).catch(x => console.log("giveItem", x));
};

const addAccountToUser = async (accountId, userId) => {
  let item1 = await createRankedItem(accountId, userId);
  let item2 = await createTournamentItem(accountId, userId);
  item1 = await API.tx(item1.txId);
  item2 = await API.tx(item2.txId);
  if (!item1 || !item2)
    return { success: false, message: "Create item error!", accountId, userId };

  let give = await giveItem({
    userId,
    items: [
      { id: item1.tokenId, quantity: 100 },
      { id: item2.tokenId, quantity: 10 }
    ]
  });

  if (!give)
    return { success: false, message: "Give item error!", accountId, userId };
  return { success: true, message: "Create item success!", accountId, userId };
};

module.exports = addAccountToUser;
