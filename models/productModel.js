import { conn } from "../config/db.js"

class ProductModel {
    static async createWithTranslation({ img, category_id, price, translations }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const [checkCategoryId] = await connection.query(
                `SELECT * FROM categories
                WHERE id = ? `, [category_id]
            )
            console.log("checkCategoryId = ", checkCategoryId);

            if (checkCategoryId.length === 0)
                throw new Error("Category Id Is Not Found.");

            const [productResult] = await connection.query(
                "INSERT INTO products (img,category_id, price) VALUES (?,?, ?)",
                [img, category_id, price]
            );
            const productId = productResult.insertId;

            for (const t of translations) {
                await connection.query(
                    `
                    INSERT INTO product_translations (product_id, lang, name, description)
                    VALUES (?, ?, ?, ?)
                `,
                    [productId, t.lang, t.name, t.description]
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

    static async updateWithTranslation({ id, category_id, img, price, translations }) {
        const connection = await conn.getConnection();
        try {
            const [productId] = await connection.query(
                `SELECT * FROM products WHERE id =? `, [id]
            )
            console.log("productId = ", productId);

            if (productId.length === 0)
                throw new Error("Product Is Not Found.");

            const [chceckCategoryId] = await connection.query(
                `SELECT * FROM categories WHERE id = ?`, [category_id]
            );
            if (chceckCategoryId.length === 0)
                throw new Error("Category Is Not Found.");

            await connection.query(
                `
                    UPDATE products SET img = ? , price = ? , category_id = ?   
                `, [img, price, category_id]
            )
            for (const t of translations) {
                const [exists] = await connection.query(
                    `
                        SELECT * FROM product_translations 
                        WHERE product_id = ? AND lang = ?
                    `, [id, t.lang]
                )
                if (exists.length > 0) {
                    await connection.query(
                        `
                            UPDATE product_translations
                            SET name = ? , description = ?
                            WHERE product_id = ? AND lang = ?
                        `, [t.name, t.description, id, t.lang]
                    )
                } else {
                    await connection.query(
                        `
                            INSERT INTO product_translations (product_id, lang, name, description)
                            VALUES (?, ?, ?, ?)
                        `,
                        [id, t.lang, t.name, t.description]
                    );
                }
            }
            await connection.commit();
            return { message: "Product updated successfully." };


        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getSingle({ lang, id }) {
        const [results] = await conn.query(
            `
                SELECT p.price , pt.name , pt.description , ct.name AS category,
                p.created_at , p.updated_at
                FROM products p
                JOIN product_translations pt
                ON p.id = pt.product_id
                JOIN categories c
                ON c.id = p.category_id
                JOIN category_translations ct
                ON c.id = ct.category_id
                WHERE pt.lang = ? AND p.id = ? AND ct.lang = ?
            `, [lang, id, lang]
        )

        return results.length ? results[0] : null;
    };


    static async getAll({ lang, limit, offset, orderById }) {
        const [results] = await conn.query(
            `
                SELECT p.price , pt.name , pt.description , ct.name AS category
                FROM products p
                JOIN product_translations pt
                ON p.id = pt.product_id
                JOIN categories c
                ON c.id = p.category_id
                JOIN category_translations ct
                ON c.id = ct.category_id
                WHERE pt.lang = ? AND ct.lang = ?
                Order BY p.id ${orderById.toUpperCase()}
                LIMIT ? 
                OFFSET ?
            `, [lang, lang, limit, offset]
        )
        return results.length ? results : null;
    }

    static async deleteById({ id }) {
        const [result] = await conn.query(`DELETE FROM products WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
    static async deleteAll() {
        const [result] = await conn.query(`DELETE FROM products`);
        return result.affectedRows;
    }

    static async count() {
        const [countRows] = await conn.query(`
            SELECT COUNT(*) AS total FROM products
        `);        
        return countRows[0].total;
    }
}
export { ProductModel };
