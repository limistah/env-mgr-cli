const axios = require("axios");
var Table = require("cli-table");
const loadCredsToObject = require("../../libs/loadCredsToObject");

// my-module.js
exports.command = "new [item] [name] [value] [project_id]";

exports.describe = "Add a new project/key";

exports.builder = {
  item: {
    default: "Project",
  },
  name: {
    default: "",
  },
  project_id: {
    default: "",
  },
  value: {
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

    if (argv.name) {
      const data = {
        name: argv.name,
        org_id: projectCreds.org_id,
      };
      if (argv.item.toLowerCase() === "keys") {
        data.project_id = argv.project_id;
        data.value = argv.value;
      }
      axios({
        method: "POST",
        url:
          argv.item.toLowerCase() === "projects"
            ? `http://localhost:3200/projects`
            : `http://localhost:3200/keys`,
        data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${projectCreds.access_token}`,
        },
      })
        .then((res) => {
          var table = new Table({
            head: ["id", "Name", "Org ID"],
            colWidths: [10, 30, 40],
          });
          table.push([res.data.id, res.data.name, res.data.org_id]);
          console.log(table.toString());
        })
        .catch((res) => {
          console.log(res.response.data.message);
        });
    } else {
      console.log("Please set a valid name");
    }
  });
};
