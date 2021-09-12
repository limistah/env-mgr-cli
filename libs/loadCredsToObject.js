const config = require("config");
const fs = require("fs");

module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.get("configFilePath"), function (err, buff) {
      if (err) {
        const e = new Error("No Authentication");
        e.name = "NO_AUTH";
        if (err.code === "ENOENT") {
          fs.mkdir(config.get("configPath"), (err) => {});
          fs.writeFile(config.get("configFilePath"), "", (err) => {});
          buff = Buffer.from("");
        } else {
          return reject(e);
        }
      }
      const data = buff.toString();
      const splitData = data.split("[");
      const configs = {};
      for (let i = 0; i < splitData.length; i++) {
        const data = splitData[i];
        const lines = data.split("\n");
        const mainKey = lines[0].replace("]", "");
        if (mainKey) {
          configs[mainKey] = {};
          lines.splice(0, 1);
          lines.map((line) => {
            splitLine = line.split("=");
            if (splitLine[0]) {
              configs[mainKey][splitLine[0]] = splitLine[1];
            }
          });
        }
      }
      resolve(configs);
    });
  });
};
