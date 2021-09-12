const axios = require("axios");
var Table = require("cli-table");
const loadCredsToObject = require("../../libs/loadCredsToObject");

// my-module.js
exports.command = "del [item] [item_id]";

exports.describe = "List all the projects";

exports.builder = {
  item: {
    default: "Project",
  },
  item_id: {
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

    const projectUrl = `http://localhost:3200/projects/${argv.item_id}`;
    const keyUrl = `http://localhost:3200/keys/${argv.item_id}`;

    if (argv.item_id) {
      axios({
        method: "DELETE",
        url: argv.item.toLowerCase() === "projects" ? projectUrl : keyUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${projectCreds.access_token}`,
        },
      })
        .then((res) => {
          console.log("Item Deleted Successfully");
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      console.log("Please set a valid id");
    }
  });
};
