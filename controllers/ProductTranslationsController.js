import { validationResult } from "express-validator";
import { ProductTranslationsModel } from "../models/productTranslationsModels.js";

const ProductTranslationsController = {
    async update(req, res) {
        try {
            const { id } = req.params;
            
            if (!id)
                return res.status(404).json({ msg: "Product ID is required" });

            const validationResultError = validationResult(req);
            if (!validationResultError.isEmpty())
                return res.status(400).json({ msg: validationResultError.array() });

            const { translations } = req.body;
            const updatedData = await ProductTranslationsModel.update({ translations, product_id: id });
            res.status(201).json({
                msg: "Product Translations updated successfully",
                id,
                updatedData
            });
        } catch (error) {
            console.error("Update Product Translations Error:", error);
            throw new Error(error.message);

        }
    },

    async deleteAll(req,res) {
        try {
            const { id } = req.params;
            console.log(id);
            
            if (!id)
                return res.status(404).json({ msg: "Product ID is required" });

            const deletedCount = await ProductTranslationsModel.deleteAll({ product_id: id });
            return res.status(200).json({
                msg: `Deleted ${deletedCount} Product Translations successfully.`
            });
        } catch (error) {
            console.error("Delete All Product Translations Erro:", error);
            throw error;
        }


    }
}

export {ProductTranslationsController};
