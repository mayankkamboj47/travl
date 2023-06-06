const app = require("./app");
// Start server
app.listen(process.env.port || 3000, ()=>console.log(`Server started on port ${process.env.port || 3000}`));