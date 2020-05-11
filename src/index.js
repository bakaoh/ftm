const express = require("express");
const API = require("./stardust");
const createUser = require("./admin/create_user");
const addAccountToUser = require("./admin/add_account");

const gameId = parseInt(process.env.SD_GAME_ID);
const users = {};
const app = express();

const warmup = async () => {
  const tokenIds = await API.getters.token.idsInGame({
    gameId,
    begin: 0,
    end: 0
  });

  const tokenDetails = await API.getters.token.getMany({
    tokenIds: tokenIds.data
  });

  tokenDetails.data.forEach(token => {
    let uid, aid;
    for (let prop of token.props) {
      if (prop.key == "uid") uid = prop.value;
      if (prop.key == "aid") aid = prop.value;
    }
    if (!uid || !aid) return;
    if (users[uid]) {
      if (!users[uid].includes(aid)) users[uid].push(aid);
    } else {
      users[uid] = [uid];
      if (uid != aid) users[uid].push(aid);
    }
  });
};
warmup();

app.engine("html", require("ejs").renderFile);

const isAdmin = async function(req, res) {
  const gameOwner = (await API.getters.game.get({ gameId })).data.owner;
  if (gameOwner !== req.params.viewerId) {
    res.status(403);
    res.send("Invalid access");
    return false;
  }
  return true;
};

app.post("/@:viewerId/createUser/:userId", async function(req, res) {
  if (!isAdmin(req, res)) return;
  let userId = req.params.userId;
  let rs = await createUser(userId);
  if (rs.success) {
    rs = await addAccountToUser(userId, userId);
    if (rs.success) users[userId] = [userId];
  }
  res.send(JSON.stringify(rs));
});

app.post("/@:viewerId/addAccount/:userId/:accountId", async function(req, res) {
  if (!isAdmin(req, res)) return;
  if (!users[req.params.userId]) {
    res.send(JSON.stringify({ success: false, message: "User not found!" }));
    return;
  }
  if (users[req.params.userId].includes(req.params.accountId)) {
    res.send(JSON.stringify({ success: false, message: "Account existed!" }));
    return;
  }
  let rs = await addAccountToUser(req.params.accountId, req.params.userId);
  if (rs.success) users[req.params.userId].push(req.params.accountId);
  res.send(JSON.stringify(rs));
});

app.get("/@:viewerId/admin", async function(req, res) {
  if (!isAdmin(req, res)) return;
  res.render(__dirname + "/views/admin.html", {
    viewerId: req.params.viewerId,
    users
  });
});

app.get("/@:viewerId", async function(req, res) {
  let tokens = [];
  const tokenIds = await API.getters.token.idsInGame({
    gameId,
    begin: 0,
    end: 0
  });
  if (tokenIds && tokenIds.data) {
    const tokenData = await API.getters.token.getMany({
      tokenIds: tokenIds.data
    });
    tokens = tokenData.data;
    const balances = await API.getters.token.balanceObjsOf({
      tokenIds: tokenIds.data,
      userId: req.params.viewerId
    });
    if (tokens.length == balances.data.length) {
      for (let i = 0; i < tokens.length; i++) {
        tokens[i].balance = balances.data[i].total;
      }
    }
  }
  res.render(__dirname + "/views/user.html", {
    viewerId: req.params.viewerId,
    tokens: tokens.filter(token => token.props.length >= 3)
  });
});

app.listen(parseInt(process.env.WEB_PORT));
