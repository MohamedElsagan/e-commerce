import { ProductImgsModel } from "../models/productImgsModel.js";

const productImgsController = {
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ msg: "Product ID is required" });

            const img = req.files || null
            const result = await ProductImgsModel.update({ product_id: id, img });

            if (!result.success) {
                return res.status(404).json({ msg: result.error });
            }

            return res.status(200).json({ msg: "Product image updated successfully" });

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async deleteById(req, res) {
        try {
            const { imgId , id } = req.params;
            if (!id || !imgId)
                return res.status(404).json({ msg: "Product ID Or Img Id is required" });

            const deleteCount = await ProductImgsModel.deleteSingle({id:imgId , product_id:id});
            res.status(200).json({ msg: deleteCount  });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message  });
            
        }
    },

    async deleteAll(req, res) {
        try {
            const { id  } = req.params;
            if (!id )
                return res.status(404).json({ msg: "Imgs Id is required" });

            const deleteCount = await ProductImgsModel.deleteAll({product_id:id});
            return res.status(200).json({ msg: deleteCount });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
            
        }
    }
}

export { productImgsController }