const config = require("config");
const fs = require("fs");

module.exports = (creds = {}) => {
  return new Promise((resolve, reject) => {
    let str = "";
    Object.keys(creds).map((project) => {
      str = `${str}[${project}]\n`;
      Object.keys(creds[project]).map((projectConfigKey) => {
        str = `${str}${projectConfigKey}=${creds[project][projectConfigKey]}\n`;
      });
      str = `${str}\n`;
    });
    fs.writeFile(config.get("configFilePath"), str, (err) => {
      if (err) {
        reject(err);
      }
      resolve(str);
    });
  });
};
