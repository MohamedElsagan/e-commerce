import { validationResult, matchedData } from "express-validator";

import { ProductModel } from "../models/productModel.js"
import { CategoryModel } from "../models/categoryModel.js";
import { ProductImgsModel } from "../models/productImgsModel.js";

const productController = {

  async create(req, res) {
    try {
      const validationResultError = validationResult(req);
      if (!validationResultError.isEmpty())
        return res.status(400).json({ msg: validationResultError.array() });

      const { stock, price, category_id, translations } = req.body;
      const img = req.files || null
      // const checkCategoryId = await CategoryModel.findById({ id: +category_id });

      // if (!checkCategoryId)
      //   return res.status(400).json({ msg: "Not Found Category" });

      const id = await ProductModel.createWithTranslation({ img, category_id, stock, price, translations });
      const data = matchedData(req);
      res.status(201).json({
        msg: "Product created successfully",
        id,
        stock,
        price,
        category_id,
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
      if (!id) return res.status(400).json({ msg: "Product ID is required" });

      const oneProduct = await ProductModel.getSingle({
        lang: req.lang,
        id
      })
      if (!oneProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }      
      const imgs = await ProductImgsModel.get({ product_id: id })
      const data = {...oneProduct , imgs}
      res.status(200).json({ msg: "sucess", data });
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
      const count = await ProductModel.count() || 0;

      const allPage = Math.max(1, Math.ceil(count / limit));
      console.log("allPage = ", allPage);

      page = + page || 1;
      if (!page || page > allPage) {
        page = allPage;
      }
      if (page <= 0)
        page = 1;
      const offset = (page - 1) * limit;

      const all = await ProductModel.getAll({ lang: req.lang, limit, offset, orderById });
      if (!all)
        return res.status(404).json({ msg: "Product not found" });


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
        return res.status(404).json({ msg: "Product ID is required" });

      const validationResultError = validationResult(req);
      if (!validationResultError.isEmpty())
        return res.status(400).json({ msg: validationResultError.array() });

      const { category_id, price, stock } = req.body;
      const updatedData = await ProductModel.update({ id, category_id, price, stock });
      res.status(201).json({
        msg: "Product updated successfully",
        id,
        updatedData
      });
    } catch (error) {
      console.error("Update Product Error:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  async deleteById(req, res) {
    try {
      const id = +req.params.id;
      if (!id)
        return res.status(404).json({ msg: "Product ID is required" });

      const deleted = await ProductModel.deleteById({ id });
      if (!deleted)
        return res.status(404).json({ msg: "Product not found" });

      return res.status(200).json({ msg: "Product deleted successfully." })
    } catch (error) {
      console.error("Delete Product Error:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  async deleteAll(req, res) {
    try {
      const deletedCount = await ProductModel.deleteAll();
      if (deletedCount === 0)
        return res.status(404).json({ msg: "No Products found to delete." });
      return res.status(200).json({
        msg: `Deleted ${deletedCount} Products successfully.`
      });
    } catch (error) {
      console.error("Delete All Products Error:", error);
      res.status(500).json({ msg: error.message });
    }
  }

}
export { productController };
