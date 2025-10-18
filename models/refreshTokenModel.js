import { conn } from "../config/db.js";

class RefreshTokenModel{
    static async create({userId , token ,expires_at	 }){
        const [result] = await conn.query(
            `INSERT INTO refresh_tokens(user_id, token , expires_at	) VALUES (?,?,?)`,
            [userId , token , expires_at ]
        );
        return result.insertId;
    }

    static async deleteByToken({token}) {
        const [result] = await conn.query(
            'DELETE FROM  refresh_tokens WHERE token = ? ',
            [token]
        );
        return result[0] ?? null;
    }

    static async findByToken({token}) {
        const [result] = await conn.query(
            'SELECT * FROM refresh_tokens WHERE token = ?',
            [token]
        );
        return result[0] ?? null;
    }
}

export {RefreshTokenModel};