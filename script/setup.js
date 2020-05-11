const stardust = require("@star-dust/client");
const API = stardust.stardustAPI;

const createAccount = async accountId => {
  return API.createAccount(accountId).catch(x =>
    console.error("createAccount", x)
  );
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getRandomInt = (max = 10000000000) =>
  Math.floor(Math.random() * Math.floor(max));

const runner = async accountId => {
  let account = await createAccount(accountId);
  if (!account) {
    console.error("Create master account error");
    return;
  }
  await sleep(5000);
  let privKey = account.privKey;
  API.config.fixers.setters = async x => await API.tx(x.txId);
  API.config.setSigners([{ accountId, privKey }]);

  let game = await API.setters.game.add({
    name: "IdleSplinterFtm" + getRandomInt(),
    desc: "IdleSplinterFtm is the market to trade FixTheMatch token!",
    image: "https://bakaoh.com/coin3.png",
    symbol: "FTM",
    rarityNames: ["Common", "Rare", "Epic", "Legendary"],
    rarityPercs: [70, 20, 9, 1]
  });
  if (!game) {
    console.error("Create game error");
    return;
  }

  console.log("WEB_PORT=1911");
  console.log(`SD_MASTER_NAME=${accountId}`);
  console.log(`SD_MASTER_PK=${privKey}`);
  console.log(`SD_GAME_ID=${game.gameId}`);
};

runner("isfmt_master_" + getRandomInt());
