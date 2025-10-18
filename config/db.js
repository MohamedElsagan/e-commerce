// // Get the client
// import mysql from 'mysql2/promise';
// import dotenv from "dotenv";

// dotenv.config(); 

// // Create the connection to database
// const conn = async()=>{
//     try {
//         return await mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password : process.env.DB_PASS,
//             database: process.env.DB_NAME,
//     })
//     } catch (error) {
//         console.log(error);
//     }
// }

// export {conn};


// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { conn };
