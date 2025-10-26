import { deleteCloudinary } from "../config/cloudinary.js";
import { conn } from "../config/db.js";
import { activeUtlis } from "../utils/activeUtlis.js";
import { ProductModel } from "./productModel.js";

class ProductImgsModel {

    static async findById({ conn, id }) {
        const [result] = await conn.query(`SELECT * FROM product_imgs WHERE id = ?`, [id]);
        return result[0] ?? null
    }
    static async findByProductId({ conn, product_id }) {
        const [result] = await conn.query(`SELECT * FROM product_imgs WHERE product_id = ?`, [product_id]);
        return result.length > 0 ? result : null;
    }
    static async getAll({conn}) {
        const [results] = await conn.query(`SELECT * FROM product_imgs`);
        return results.length > 0 ? results : null;

    }

    static async insert({ conn, img_path, img_filename, isMain, product_id }) {
        const [result] = await conn.query(`INSERT INTO product_imgs (url_cloudinary,file_name_cloudinary ,is_main, product_id) VALUES (?,?, ?, ?)`,
            [img_path, img_filename, isMain, product_id]
        );
    }

    static async deleteSingle({ id, product_id }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const checkProduct = await ProductModel.findById({ connection, id: product_id });

            if (!checkProduct) {
                throw new Error("Product not found");
            }
            const find = await this.findById({ conn: connection, id });
            if (find) {
                if (find.is_main === 1) {
                    const [rows] = await connection.query(`SELECT * FROM product_imgs WHERE product_id = ? ORDER BY is_main DESC`, find.product_id);
                    if (rows.length > 1) {
                        const isMain = activeUtlis.TRUE;
                        await connection.query(`UPDATE product_imgs SET is_main = ? WHERE product_id = ? AND id =? `, [isMain, rows[1].product_id, rows[1].id])
                    }
                }
                await deleteCloudinary(find.file_name_cloudinary);
                const [result] = await connection.query(`DELETE FROM product_imgs WHERE id = ? `, [id]);
                await connection.commit();
                return result.affectedRows;
            }
            await connection.commit();
            return null;
        } catch (error) {
            await connection.rollback();
            throw (error)

        } finally {
            connection.release();
        }
    }

    static async deleteAll({ product_id }) {
        const connection = await conn.getConnection();
        try {
            await connection.beginTransaction();
            const checkProduct = await ProductModel.findById({ connection, id: product_id });
            if (!checkProduct) {
                throw new Error("Product not found");
            }

            const checkImgId = await this.findByProductId({ conn: connection, product_id })
            if (!checkImgId)
                throw new Error("nooooo img");

            for (const c of checkImgId) {
                await deleteCloudinary(c.file_name_cloudinary);
            }
            const [result] = await connection.query(`DELETE FROM product_imgs WHERE product_id = ?  `, [product_id]);
            await connection.commit();
            return result.affectedRows > 0 ? result.affectedRows : null;

        } catch (error) {
            await connection.rollback();
            console.log(error);
            throw error
        } finally {
            connection.release();
        }
    }

    static async create({ conn, img, product_id, is_main }) {
        let isMain = is_main;
        if (img && Array.isArray(img) && img.length > 0) {
            for (const url of img) {
                await this.insert({ conn, img_path: url.path, img_filename: url.filename, isMain, product_id })
                isMain = activeUtlis.FALSE;
            }
        } else if (img && img.length === 1) {
            await this.insert({ conn, img_path: img.path, img_filename: img.filename, isMain, product_id });
        } else {

        }
    }

    static async update({ product_id, img }) {
        const connection = await conn.getConnection();

        try {
            const checkProduct = await ProductModel.findById({ connection, id: product_id });
            if (!checkProduct) {
                throw new Error("Product not found");
            }

            await connection.beginTransaction();

            await this.create({
                conn: connection,
                img,
                product_id,
                is_main: activeUtlis.FALSE
            });

            await connection.commit();

            return { success: true };

        } catch (error) {
            await connection.rollback();
            console.error("Error updating product image:", error.message);
            return { success: false, error: error.message };

        } finally {
            connection.release();
        }
    }



    static async getIsMain({ product_id }) {
        const [results] = await conn.query(`SELECT * FROM product_imgs WHERE product_id = ? AND is_main = 1`, product_id);
        return results.length > 0 ? results[0] : null;
    }
    static async updateIsMain({ product_id }) {
    }

}
export { ProductImgsModel };