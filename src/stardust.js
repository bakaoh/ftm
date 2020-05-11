require("dotenv").config();
const stardust = require("@star-dust/client");

const accountId = process.env.SD_MASTER_NAME;
const privKey = process.env.SD_MASTER_PK;

const API = stardust.stardustAPI;

API.config.setSigners([{ accountId, privKey }]);

module.exports = API;
