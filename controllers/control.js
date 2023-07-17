const Product = require('../models/Product'); // Assuming you have a Product model

const deleteProduct = async (req,res) =>{
    try{
        const {id:productID} = req.params
        const products = await Product.findOneAndDelete({_id:productID})
        if (!product){
            return res.status(404).json({msg:`No product with id: ${productID}`})
        }
        res.status(200).json({ products })
    }
    catch (error){
        res.status(404).json({ msg:error })
    }
}

module.exports = deleteProduct;