const API = require("../stardust.js");
const gameId = parseInt(process.env.SD_GAME_ID);

const exists = async accountId => {
  const response = await API.getters.user
    .getId({ accountId })
    .catch(x => console.log("exists", x));
  return response.data > -1;
};

const giveGameApproval = async (gameId, accountId, accountKeys) => {
  const gameOwner = (await API.getters.game.get({ gameId })).data.owner;
  const signer = { accountId, privKey: accountKeys.privKey };
  return API.setters.approval
    .setApprovalForAll({ to: `*.${gameOwner}`, approved: true }, signer)
    .catch(x => console.log("approval", x));
};

const createUser = async userId => {
  if (await exists(userId))
    return {
      success: false,
      message: `${userId} already exists!`,
      userId
    };

  const accountKeys = await API.createAccount(userId).catch(x =>
    console.log(x)
  );
  if (!accountKeys)
    return { success: false, message: "Create user error!", userId };

  await API.tx(accountKeys.txId);
  console.log("createUser", { userId, accountKeys });

  const data = await giveGameApproval(gameId, userId, accountKeys);
  if (!data)
    return {
      success: false,
      message: `Could not give approval!`,
      userId
    };

  return { success: true, message: `${userId} created!`, userId };
};

module.exports = createUser;
