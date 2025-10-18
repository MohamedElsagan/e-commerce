import { conn } from "../config/db.js"

class ProductModel {
    static async createWithTranslation({img,price , translations}){
        const connection = await conn.getConnection(); 
        try {
            await connection.beginTransaction(); 

            const [productResult] = await connection.query(
                "INSERT INTO products (img, price) VALUES (?, ?)",
                [img, price]
            );
            const productId = productResult.insertId;

            for (const t of translations) {
                await connection.query(
                `
                    INSERT INTO product_translations (product_id, lang, name, decription)
                    VALUES (?, ?, ?, ?)
                `,
                [productId, t.lang, t.name, t.decription]
                );
            }

            await connection.commit(); // 4️⃣ تأكيد العملية
            return productId;
        } catch (error) {
            await connection.rollback(); // 5️⃣ التراجع عن التغييرات
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getSingle({lang , id}) {
        const [results] = await conn.query(
            `
                SELECT p.price , pt.name , pt.decription FROM products p
                JOIN product_translations pt
                ON p.id = pt.product_id
                WHERE pt.lang = ? AND p.id = ?
            `,[lang , id]
        )
        
        return results.length ? results[0] : null;
    };


    static async getAll({lang , limit , offset , orderById}){
        const [results] = await conn.query(
            `
                SELECT p.id , pt.name , p.price, pt.decription
                FROM products p
                JOIN product_translations pt
                ON p.id = pt.product_id
                WHERE pt.lang = ?
                Order BY p.id ${orderById.toUpperCase()}
                LIMIT ? 
                OFFSET ?
            `,[lang   , limit , offset ]
        )
        return results.length ? results : null;
    }

    static async count(){
        const [countRows] = await conn.query(`
            SELECT COUNT(*) AS total FROM products
        `);
        return countRows[0].total;
    }
}
export{ProductModel};
