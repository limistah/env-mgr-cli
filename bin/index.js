#!/usr/bin/env node
const loadCredentialsFile = require("../libs/loadCredentials");
const authorizeUser = require("../libs/authorizeUser");
const yargs = require("yargs");
const { argv } = require("yargs");

const options = yargs.option("a", {
  alias: "auth",
}).argv;

loadCredentialsFile
  .then(async (val) => {
    require("yargs/yargs")(process.argv.slice(2))
      .command(require("./commands/auth"))
      .command(require("./commands/lsItems"))
      .command(require("./commands/addItem"))
      .command(require("./commands/delItem"))
      .command(require("./commands/loadProject"))
      .demandCommand()
      .help()
      .wrap(72).argv;
  })
  .catch(async (e) => {
    if (e.name === "NO_AUTH") {
      if (options.auth) {
        // Initialize authorization
        await authorizeUser(options.auth === true ? "default" : options.auth);
      } else {
        // console.log(e.message, "e");
      }
      console.log("Please Authenticate Env Mgr with: env-mgr auth");
    }
  });
