const express = require("express");
const getPort = require("get-port");
const { v4: uuid } = require("uuid");
const open = require("open");
const cors = require("cors");
const addToCredentials = require("./addToCredentials");

const challengeKey = uuid();
let server = null;
const app = express();
app.use(cors("*"));
app.use(express.json());
app.get("/", (req, res, next) => {
  const { challenge, token, project, org_id } = req.query;

  if (challenge === challengeKey) {
    process.nextTick(() => {
      addToCredentials(project || "default", token, org_id, () => {
        server.close(() => {
          console.log("user authorized");
        });
      });
    });
  }

  return res.json({ message: "Confirmed" });
});

const authorizeUser = async (project = "default") => {
  const randomPort = await getPort();

  const callbackURL = `http://localhost:${randomPort}/?challenge=${challengeKey}&project=${
    project || "default"
  }`;
  const challengeBrowserURL = `http://localhost:3000/oauth?callback=${callbackURL}`;
  server = app.listen(randomPort, () => {
    console.log(
      `Authorizing User, continue in the browser at ${challengeBrowserURL}`
    );
    open(challengeBrowserURL);
  });
};

module.exports = authorizeUser;
