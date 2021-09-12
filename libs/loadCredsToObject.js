const config = require("config");
const fs = require("fs");

module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.get("configFilePath"), function (err, buff) {
      if (err) {
        reject(err);
      }
      const data = buff.toString();
      const splitData = data.split("[");
      // console.log(splitData);
      const config = {};
      for (let i = 0; i < splitData.length; i++) {
        const data = splitData[i];
        const lines = data.split("\n");
        const mainKey = lines[0].replace("]", "");
        if (mainKey) {
          config[mainKey] = {};
          lines.splice(0, 1);
          lines.map((line) => {
            splitLine = line.split("=");
            if (splitLine[0]) {
              config[mainKey][splitLine[0]] = splitLine[1];
            }
          });
        }
      }
      resolve(config);
    });
  });
};
