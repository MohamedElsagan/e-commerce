import {conn} from '../config/db.js';

class PasswordResetModel {
    static async create({user_id,token,expiresAt}){
        const [result] = await conn.query(
            `INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)`,
            [user_id, token, expiresAt]
        )
        return result.insertId;
    }
    
    static async findByToken({token}) {
        const [rows] = await conn.query(
            `SELECT * FROM password_resets WHERE token = ?`,
            [token]
        );
        return rows[0] ?? null;
    }
    static async markUsed({id}) {
        await conn.query(`UPDATE password_resets SET used = 1 WHERE id = ?`, [id]);
    }

    static async deleteByUser({user_id}) {
        await conn.query(`DELETE FROM password_resets WHERE user_id = ?`, [user_id]);
    }
}

export {PasswordResetModel};



// const findRefreshToken = async(refreshToken)=>{
//     const [results] = await conn.query(
//         "SELECT * FROM `password_reseats` WHERE `reset_token` = ?",
//         [refreshToken]
//     );
//     return results.length > 0 ? results[0] : null;
// }

// const createPasswordReseats = async({user_id , hashed_token })=>{
//     const [results] = await conn.query(
//         "INSERT INTO `password_reseats`(`user_id`, `hashed_token`) VALUES (?,?)" , 
//         [user_id , hashed_token ]
//     )
//     // return results.insertedId;
// }

// const findPasswordReseatsByUserId = async(user_id)=>{
//     const [rows] = await conn.query(
//         "SELECT * FROM password_reseats WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
//         [user_id]
//     );
//     return rows[0];
// }

// export {findRefreshToken , createPasswordReseats , findPasswordReseatsByUserId}