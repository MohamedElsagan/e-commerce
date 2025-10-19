import { validationResult, matchedData } from "express-validator";

import { ProductModel } from "../models/productModel.js"

const productController = {

  async create(req, res) {
    try {
      const validationResultError = validationResult(req);
      if (!validationResultError.isEmpty())
        return res.status(400).json({ msg: validationResultError.array() });

      const { img,category_id ,price, translations } = req.body;
      const id = await ProductModel.createWithTranslation({ img, category_id ,price, translations });
      const data = matchedData(req);

      res.status(201).json({
        msg: "Product created successfully",
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
      if (!id) return res.status(400).json({ msg: "Product ID is required" });

      const oneProduct = await ProductModel.getSingle({
        lang: req.lang,
        id
      })
      if (!oneProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }

      res.status(200).json({ msg: oneProduct });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      let { limit, page, orderById } = req.query;
      limit = + limit || 3;
      const count = await ProductModel.count();
      const allPage = Math.ceil(count / limit);

      if (!orderById || (orderById.toUpperCase() !== "DESC" && orderById.toUpperCase() !== "ASC")) {
        orderById = "ASC";
      }

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
  }

}
export { productController };
