process.title = "Marmitas";

const args = process.argv,
    port = args[2] || 7070
    AppServer = require("./AppServer");

const as = new AppServer(args);

const ws = as.startServer();

ws.listen(port, () => {
    console.log('Server started at port ' + port);
});