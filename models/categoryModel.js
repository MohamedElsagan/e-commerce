import { deleteCloudinary } from "../config/cloudinary.js";
import { conn } from "../config/db.js";
class CategoryModel {
    static async findById({ connection, id }) {
        const [result] = await connection.query(
            `SELECT * FROM categories WHERE id = ?`, [id]
        );
        return result[0] ?? null
    }
    static async createWithTranslation({ url_cloudinary, file_name_cloudinary, translations }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const [categoryResult] = await connection.query(
                "INSERT INTO categories (url_cloudinary , file_name_cloudinary) VALUES (?,?)",
                [url_cloudinary, file_name_cloudinary]
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

    static async updateWithTranslation({ id, url_cloudinary, file_name_cloudinary, translations }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const category = await this.findById({ connection, id });
            if (!category)
                throw new Error("Category Is Not Found.");

            if (url_cloudinary && file_name_cloudinary) {
                const deleteOldCloudinary = await deleteCloudinary(category.file_name_cloudinary);
                await connection.query(
                    `
                    UPDATE categories SET url_cloudinary = ? , file_name_cloudinary = ?
                    WHERE id = ?
                    `, [url_cloudinary, file_name_cloudinary, id]
                );
            }

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
                } else {
                    await connection.query(
                        `
                            INSERT INTO category_translations (category_id, lang, name, description)
                            VALUES (?, ?, ?, ?)
                        `,
                        [id, t.lang, t.name, t.description]
                    );
                }
            }
            await connection.commit();
            return { message: "Category updated successfully." };
        } catch (error) {
            await connection.rollback();
            console.error("Transaction failed:", error.message);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getSingle({ lang, id }) {
        const [results] = await conn.query(
            `
                SELECT ct.name , ct.description , c.url_cloudinary , c.file_name_cloudinary , c.created_at , c.updated_at
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
                SELECT ct.name , ct.description , c.url_cloudinary , c.file_name_cloudinary , c.created_at , c.updated_at
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
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const publicId = await this.findById({ connection, id });
            if (publicId) {
                const deleteOldCloudinary = await deleteCloudinary(publicId.file_name_cloudinary);
                const [result] = await connection.query(`DELETE FROM categories WHERE id = ?`, [id]);
                return result.affectedRows > 0;
            }
            return null

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }


    }
    static async deleteAll() {
        const [rows] = await conn.query(`SELECT * FROM categories`);
        for (const url of rows) {
            if (url.file_name_cloudinary != null) {

                const deleteOldCloudinary = await deleteCloudinary(url.file_name_cloudinary);
            }
        }
        const [result] = await conn.query(`DELETE FROM categories`);
        return result.affectedRows;
    }
    static async count() {
        const [countRows] = await conn.query(`
            SELECT COUNT(*) AS total FROM categories
        `);
        return countRows[0].total;
    }

}

export { CategoryModel };