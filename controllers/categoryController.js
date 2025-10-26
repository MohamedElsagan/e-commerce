import { matchedData, validationResult } from 'express-validator';
import { CategoryModel } from '../models/categoryModel.js';

const categoryController = {

    async create(req, res) {
        try {
            const validationResultError = validationResult(req);
            if (!validationResultError.isEmpty())
                return res.status(400).json({ msg: validationResultError.array() });

            let translations = req.body.translations;
            const url_cloudinary = req.file?.path || null;
            const file_name_cloudinary = req.file?.filename || null;

            const id = await CategoryModel.createWithTranslation({ url_cloudinary, file_name_cloudinary, translations });
            const data = matchedData(req);

            res.status(201).json({
                msg: "Category created successfully",
                id,
                data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message });
        }
    },

    async getSingle(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ msg: "Category ID is required" });

            const oneCategory = await CategoryModel.getSingle({
                lang: req.lang,
                id
            })
            if (!oneCategory) {
                return res.status(404).json({ msg: "Category not found" });
            }
            res.status(200).json({ msg: oneCategory });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            let { limit, page, orderById } = req.query;

            if (Array.isArray(orderById))
                orderById = req.query.orderById[0];

            if (typeof orderById !== "string" || !["ASC", "DESC"].includes(orderById.toUpperCase())) {
                orderById = "ASC";
            }

            limit = + limit || 3;
            const count = await CategoryModel.count() || 0;
            const allPage = Math.max(1, Math.ceil(count / limit));

            page = + page || 1;
            if (!page || page > allPage) {
                page = allPage;
            }
            if (page <= 0)
                page = 1;
            const offset = (page - 1) * limit;

            const all = await CategoryModel.getAll({ lang: req.lang, limit, offset, orderById });
            if (!all)
                return res.status(404).json({ msg: "Category not found" });
            res.status(200).json({ msg: all, page, allPage });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ msg: "Category ID is required" });

            const validationResultError = validationResult(req);
            if (!validationResultError.isEmpty())
                return res.status(400).json({ msg: validationResultError.array() });

            let translations = req.body.translations;
            // const img = req.file ? req.file.filename : null;
            const url_cloudinary = req.file?.path || null;
            const file_name_cloudinary = req.file?.filename || null;
            const updatedData = await CategoryModel.updateWithTranslation({ id, url_cloudinary ,file_name_cloudinary, translations });
            res.status(201).json({
                msg: "Category updated successfully",
                id,
                updatedData
            });
        } catch (error) {
            console.error("Update Category Error:", error);
            res.status(500).json({ msg: error.message });
        }
    },

    async deleteById(req, res) {
        try {
            const id = +req.params.id;
            if (!id)
                return res.status(404).json({ msg: "Category ID is required" });

            const deleted = await CategoryModel.deleteById({ id });
            
            if (! deleted)
                return res.status(404).json({ msg: "Category not found" });

            return res.status(200).json({ msg: "Category deleted successfully." })
        } catch (error) {
            console.error("Delete Category Error:", error);
            res.status(500).json({ msg: error.message });
        }
    },

    async deleteAll(req, res) {
        try {
            const deletedCount = await CategoryModel.deleteAll();
            if (deletedCount === 0)
                return res.status(404).json({ msg: "No categories found to delete." });
            return res.status(200).json({
                msg: `Deleted ${deletedCount} categories successfully.`
            });
        } catch (error) {
            console.error("Delete All Categories Error:", error);
            res.status(500).json({ msg: error.message });
        }
    }

}

export { categoryController };