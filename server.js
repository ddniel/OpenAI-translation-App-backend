const app = require("./src/App");
require("dotenv").config();

app.listen(5500, () => {
  console.log("App running at: http://localhost:5500");
});
