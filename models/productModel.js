import { deleteCloudinary } from "../config/cloudinary.js";
import { conn } from "../config/db.js"
import { activeUtlis } from "../utils/activeUtlis.js"
import { CategoryModel } from "./categoryModel.js";
import { ProductImgsModel } from "./productImgsModel.js";
import { ProductTranslationsModel } from "./productTranslationsModels.js";

class ProductModel {
    static async findById({ connection, id }) {
        const [productId] = await connection.query(`SELECT * FROM products WHERE id =? `, [id])
        return productId[0] ?? null;
    }

    static async insert({ connection, category_id, stock, is_available, price }) {
        const [productResult] = await connection.query(`INSERT INTO products (category_id, stock, is_available, price) VALUES (?, ?, ?, ?)`,
            [category_id, stock, is_available, price]
        );
        return productResult.insertId;
    }

    static async createWithTranslation({ img, category_id, stock, price, translations }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const checkCategoryId = await CategoryModel.findById({ connection, id: category_id })
            if (!checkCategoryId)
                throw new Error("Category Id Is Not Found.");

            const productId = await this.insert({ connection, category_id, stock, is_available: activeUtlis.TRUE, price });
            await ProductImgsModel.create({ conn: connection, img, product_id: productId, is_main: activeUtlis.TRUE })
            if (Array.isArray(translations) && translations.length > 0) {
                for (const t of translations) {
                    await ProductTranslationsModel.insert({ connection, product_id: productId, lang: t.lang, name: t.name, description: t.description })
                }
            }
            await connection.commit();
            return productId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }


    static async update({ id, category_id, price, stock }) {
        const connection = await conn.getConnection();
        try {
            const productId = await this.findById({ connection, id })
            if (!productId)
                throw new Error("Product Is Not Found.");

            const checkCategoryId = await CategoryModel.findById({ connection, id: category_id })
            if (!checkCategoryId)
                throw new Error("Category Id Is Not Found.");

            await connection.query(`UPDATE products SET stock = ? , price = ?, category_id = ? WHERE id = ?`, [stock, price, category_id, id]);
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
                SELECT pt.name ,p.price , p.stock,pt.description , ct.name AS category, p.created_at , p.updated_at
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
                SELECT p.id , p.price  ,pt.name ,pi.url_cloudinary AS img, ct.name AS category
                FROM products p
                JOIN product_imgs pi
                ON p.id = pi.product_id
                JOIN product_translations pt
                ON p.id = pt.product_id
                JOIN categories c
                ON c.id = p.category_id
                JOIN category_translations ct
                ON c.id = ct.category_id
                WHERE pt.lang = ? AND ct.lang = ?  AND pi.is_main = 1
                Order BY p.id ${orderById.toUpperCase()}
                LIMIT ? 
                OFFSET ?
            `, [lang, lang, limit, offset]
        )
        return results.length ? results : null;
    }

    static async deleteById({ id }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const productId = await this.findById({ connection, id })
            if (!productId)
                throw new Error("Product Is Not Found.");

            const checkImgId = await ProductImgsModel.findByProductId({ conn: connection, product_id: id });
            if (checkImgId) {
                for (const c of checkImgId) {
                    await deleteCloudinary(c.file_name_cloudinary);
                }
            }
            const [result] = await connection.query(`DELETE FROM products WHERE id = ?`, [id]);
            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw error;
        } finally {
            connection.release();
        }
    }
    static async deleteAll() {
        const connection = await conn.getConnection();
        try {
            const checkImgId = await ProductImgsModel.getAll({ conn: connection });
            if (checkImgId) {
                for (const c of checkImgId) {
                    await deleteCloudinary(c.file_name_cloudinary);
                }
                
            }
            const [result] = await connection.query(`DELETE FROM products`);
            await connection.commit();
            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw error;
        } finally {
            connection.release();

        }
    }

    static async count() {
        const [countRows] = await conn.query(`SELECT COUNT(*) AS total FROM products`);
        return countRows[0].total;
    }



}
export { ProductModel };
