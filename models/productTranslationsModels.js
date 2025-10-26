import { conn } from "../config/db.js";
import { ProductModel } from "./productModel.js";

class ProductTranslationsModel {

    static async insert({ connection, product_id, lang, name, description }) {
        const [result] = await connection.query(
            `INSERT INTO product_translations (product_id, lang, name, description) VALUES (?, ?, ?, ?)`,
            [product_id, lang, name, description]
        );
        return result.insertId;
    }

    static async update({ translations, product_id }) {
        let connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const checkProduct = await ProductModel.findById({ connection, id: product_id });
            if (!checkProduct)
                throw new Error("noooo proooooooduct");

            for (const t of translations) {
                const [exists] = await connection.query(
                    `SELECT * FROM product_translations WHERE product_id = ? AND lang = ?`,
                    [product_id, t.lang]
                )
                if (exists.length > 0) {
                    await connection.query(
                        `UPDATE product_translations SET name = ? , description = ? WHERE product_id = ? AND lang = ?`,
                        [t.name, t.description, product_id, t.lang]
                    )
                } else {
                    await this.insert({ connection, product_id, lang: t.lang, name: t.name, description: t.description })

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

    static async deleteAll({ product_id }) {
        let connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const checkProduct = await ProductModel.findById({ connection, id: product_id });
            if (checkProduct) {
                const [result] = await connection.query(`DELETE FROM product_translations WHERE product_id = ?`, [checkProduct.id]);
                await connection.commit();

                return result.affectedRows;
            }
            await connection.commit();

            return null;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export { ProductTranslationsModel };