// import express
import express from "express";
// import cors
import bodyParser from 'body-parser';
 
import cors from "cors";
 
// import routes
import router from "./api/api.mjs";

// init express
const app = express();
  
// use express json
app.use(express.json());

// use cors
app.use(cors({
    origin: 'http://localhost:8080'
}));
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
// use router
app.use('/api/v1', router);

app.listen(3000, () => console.log('Server running at http://localhost:3000'));