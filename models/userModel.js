import { conn } from "../config/db.js";

class UserModel {
  static async create({name , email , password }){
    const [result] = await conn.query(
        `INSERT INTO users(name, email, password) VALUES (?,?,?)`,
        [name, email, password]
    )
    return result;
  }

  static async findEmail({email}){
    const [result] = await conn.query(
        `SELECT * FROM users WHERE email = ? ` , [email]
    )
    return result[0] ?? null;
  }

  static async findById({id}){
    const [row] = await conn.query(
      `SELECT * FROM users WHERE id = ?`,[id]
    );
    return row[0] ?? null;
  }

  static async setPassword({id , hashedPassword}){
    await conn.query(
      `UPDATE users SET password = ? WHERE id = ?`,[hashedPassword , id]
    );
  }

  static async findOrCreate({ profileId, profileDisplayName, profileEmail, profilePhoto }){
    const connection = await conn.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT * FROM users WHERE google_id = ?`,
        [profileId]
      );
      if (rows.length > 0)
        return rows[0];
  
      const [result] = await connection.query(
        `INSERT INTO users(name, email, img, google_id) VALUES (?,?,?,?)`,
        [profileDisplayName, profileEmail, profilePhoto, profileId]
      );
  
      const [newUser] = await conn.query(
        `SELECT * FROM users WHERE id = ?`,
        [result.insertId]
      );
  
      return newUser[0];
    } catch (error) {
      await connection.rollback(); 
      throw error;
    } finally{
      connection.release();
    }
      
    }

  }
export {UserModel};







// EMAIL
// const findEmail = async (email) => {
//     const [result] = await conn.query(
//         "SELECT * FROM `users` WHERE `email` = ? " , [email]
//     )
//     return result.length > 0 ? result[0] : null;
// }

// const createUser = async ({name , email , password })=>{
//     const [result] = await conn.query(
//         "INSERT INTO `users`(`name`, `email`, `password`) VALUES (?,?,?)",
//         [name, email, password]
//     )
//     return result;
// }

// const updatePassword = async({password,id})=>{
//   const update = await conn.query(
//     "UPDATE `users` SET `password`= ? WHERE `id` = ?" ,
//     [password,id]
//   );
// }

// /// GOOGLE 
// const findOrCreate = async ({ profileId, profileDisplayName, profileEmail, profilePhoto }) => {
//   const [rows] = await conn.query(
//     "SELECT * FROM `users` WHERE `google_id` = ?",
//     [profileId]
//   );

//   if (rows.length > 0) return rows[0];

//   const [result] = await conn.query(
//     "INSERT INTO `users`(`name`, `email`, `img`, `google_id`) VALUES (?,?,?,?)",
//     [profileDisplayName, profileEmail, profilePhoto, profileId]
//   );

//   const [newUser] = await conn.query(
//     "SELECT * FROM `users` WHERE `id` = ?",
//     [result.insertId]
//   );

//   return newUser[0];
// };

// export {findEmail , createUser , findOrCreate , updatePassword};