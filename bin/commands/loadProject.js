const axios = require("axios");
var fs = require("fs");
var path = require("path");
const loadCredsToObject = require("../../libs/loadCredsToObject");

// my-module.js
exports.command = "load [project_id] [filename]";

exports.describe = "Load all the env values for a project";

exports.builder = {
  filename: {
    default: "./.env",
  },
  project_id: {
    default: "",
  },
};

exports.handler = function (argv) {
  loadCredsToObject().then((creds) => {
    const projectCreds = creds["default"];
    if (!projectCreds.access_token || !projectCreds.org_id) {
      console.log("Please authorize the cli");
      return;
    }
    const keyUrl = `https://env-mgr.herokuapp.com/keys?project=${argv.project_id}&org=${projectCreds.org_id}`;

    axios(keyUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${projectCreds.access_token}`,
      },
    })
      .then((res) => {
        let str = "";
        res.data.map((key) => {
          str = `${str}${key.name}=${key.value}\n`;
        });

        const filePath = path.resolve(argv.filename);

        fs.writeFile(filePath, str, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log("Exported to %s", filePath);
        });

        // // instantiate
        // if (argv.item.toLowerCase() === "projects") {
        //   var table = new Table({
        //     head: ["id", "Name", "Org ID"],
        //     colWidths: [10, 30, 40],
        //   });
        //   res.data.map((p) => table.push([p.id, p.name, p.org_id]));
        //   console.log(table.toString());
        // } else {
        //   var table = new Table({
        //     head: ["id", "Name", "Value", "Org ID"],
        //     colWidths: [10, 20, 20, 20],
        //   });
        //   res.data.map((p) => table.push([p.id, p.name, p.value, p.org_id]));
        //   console.log(table.toString());
        // }
      })
      .catch((res) => {
        console.log(res);
      });
  });
};
