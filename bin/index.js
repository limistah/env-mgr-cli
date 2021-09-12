#!/usr/bin/env node
const loadCredentialsFile = require("../libs/loadCredentials");
const authorizeUser = require("../libs/authorizeUser");

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
      // Check if the auth argument is passed, else tell the user that the auth is missing
      if (options.auth) {
        // Initialize authorization
        await authorizeUser(options.auth);
      } else {
        console.log(e.message);
      }
    }
  });
