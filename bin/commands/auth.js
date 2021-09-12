const authorizeUser = require("../../libs/authorizeUser");
const loadCredsToObject = require("../../libs/loadCredsToObject");

// my-module.js
exports.command = "auth";

exports.describe = "Authorize the CLI";

exports.builder = {};

exports.handler = async function (argv) {
  await authorizeUser();
};
