import serverless from "serverless-http";
import app from "../backend/src/index";
console.log("Serverless function loaded api dir");

export default serverless(app);