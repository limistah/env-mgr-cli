const axios = require("axios");
var Table = require("cli-table");
const loadCredsToObject = require("../../libs/loadCredsToObject");

// my-module.js
exports.command = "ls [item] [project_id]";

exports.describe = "List all the projects";

exports.builder = {
  item: {
    default: "Project",
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
    if (!["keys", "projects"].includes(argv.item.toLowerCase())) {
      return console.log("only projects and items are supported");
    }

    if (argv.item.toLowerCase() === "projects" || argv.project_id) {
      const projectUrl = `https://env-mgr.herokuapp.com/projects?org=${projectCreds.org_id}`;
      const keyUrl = `https://env-mgr.herokuapp.com/keys?project=${argv.project_id}`;

      axios(argv.item.toLowerCase() === "projects" ? projectUrl : keyUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${projectCreds.access_token}`,
        },
      })
        .then((res) => {
          // instantiate
          if (argv.item.toLowerCase() === "projects") {
            var table = new Table({
              head: ["id", "Name", "Org ID"],
              colWidths: [10, 30, 40],
            });
            res.data.map((p) => table.push([p.id, p.name, p.org_id]));
            console.log(table.toString());
          } else {
            var table = new Table({
              head: ["id", "Name", "Value", "Org ID"],
              colWidths: [10, 20, 20, 20],
            });
            res.data.map((p) => table.push([p.id, p.name, p.value, p.org_id]));
            console.log(table.toString());
          }
        })
        .catch((res) => {
          console.log(res.response.data.message);
        });
    } else {
      console.log("Please set a valid project_id");
    }
  });
};
