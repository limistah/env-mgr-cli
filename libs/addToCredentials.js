const loadCredsToObject = require("./loadCredsToObject");
const saveCredsFromObject = require("./saveCredsFromObject");

const addToCredentials = (project, token, org_id, doneCB) => {
  loadCredsToObject().then(async (creds = {}) => {
    if (!creds[project]) {
      creds[project] = {};
    }
    creds[project]["access_token"] = token;
    creds[project]["org_id"] = org_id;
    await saveCredsFromObject(creds);
    doneCB();
  });
};

module.exports = addToCredentials;
