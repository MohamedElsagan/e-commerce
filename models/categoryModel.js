import { conn } from "../config/db.js";
class CategoryModel {

    static async createWithTranslation({ img, translations }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const [categoryResult] = await connection.query(
                "INSERT INTO categories (img) VALUES (?)",
                [img]
            )
            const categoryId = categoryResult.insertId;
            for (const t of translations) {
                await connection.query(
                    `
                        INSERT INTO category_translations( lang, name, description, category_id) 
                        VALUES (?,?,?,?)
                    `,
                    [t.lang, t.name, t.description, categoryId]
                )
            }
            await connection.commit();
            return categoryId;
        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {
            connection.release()
        }
    }

    static async updateWithTranslation({ id, img, translations }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const [category] = await connection.query(
                `SELECT * FROM categories WHERE id = ?`, [id]
            );
            if (category.length === 0)
                throw new Error("Category Is Not Found.");

            await connection.query(
                `
                UPDATE categories SET img = ?
                WHERE id = ?
                `, [img, id]
            );

            for (const t of translations) {
                const [exists] = await connection.query(
                    `
                SELECT * FROM category_translations 
                WHERE category_id = ? AND lang = ?
                `,
                    [id, t.lang]
                );

                if (exists.length > 0) {

                    await connection.query(
                        `
                    UPDATE category_translations
                    SET name = ?, description = ?
                    WHERE category_id = ? AND lang = ?
                    `,
                        [t.name, t.description, id, t.lang]
                    );
                    await connection.commit();
                } else {

                    return { message: "Category Not updated successfully." };
                }

            }
            return { message: "Category updated successfully." };
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
                SELECT ct.name , ct.description , c.img , c.created_at , c.updated_at
                FROM categories c
                JOIN category_translations ct
                ON c.id = ct.category_id
                WHERE ct.lang = ? AND c.id = ?
            `, [lang, id]
        )

        return results.length ? results[0] : null;
    }
    static async getAll({ lang, limit, offset, orderById }) {
        const [results] = await conn.query(
            `
                SELECT ct.name , ct.description , c.img , c.created_at , c.updated_at
                FROM categories c
                JOIN category_translations ct
                ON c.id = ct.category_id
                WHERE ct.lang = ?
                Order BY c.id ${orderById.toUpperCase()}
                LIMIT ? 
                OFFSET ?
            `, [lang, limit, offset]
        )
        return results.length ? results : null;
    }
    static async deleteById({ id }) {
        const [result] = await conn.query(`DELETE FROM categories WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
    static async deleteAll() {
        const [result] = await conn.query(`DELETE FROM categories`);
        return result.affectedRows ;
    }
    static async count() {
        const [countRows] = await conn.query(`
            SELECT COUNT(*) AS total FROM categories
        `);
        return countRows[0].total;
    }

}

export { CategoryModel };