process.title = "Marmitas";

const args = process.argv,
    port = args[2] || 7070,
    App = require("./src/App");

const app = new App(args);

const ws = app.startServer();

ws.listen(port, () => {
    console.log('Server started at port ' + port);
});