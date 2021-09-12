const loadCredsToObject = require("./loadCredsToObject");

const LoadConfigFile = new Promise((resolve, reject) => {
  return loadCredsToObject().then((cred) => {
    if (!cred.default || !cred.default.access_token) {
      const err = new Error("Please authenticate the project");
      err.name = "NO_AUTH";
      return reject(err);
    }
    resolve(cred);
  });
});

module.exports = LoadConfigFile;
