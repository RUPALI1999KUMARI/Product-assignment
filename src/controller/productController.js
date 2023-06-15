const productModel = require("../model/productModel");

const createProduct = async (req, res) => {
  try {
    let { name, description, price, varient } = req.body;
    if (!name || !description || !price) {
      return res
        .status(400)
        .send({ status: false, msg: "required field missing" });
    }
    const uploadData = await productModel.create(req.body);
    return res.status(201).send({ status: true, data: uploadData });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const searchProduct = async (req, res) => {
  try {
    const searchQuery = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
            {
              varient: {
                $elemMatch: {
                  $or: [{ name: { $regex: req.query.search, $options: "i" } }],
                },
              },
            },
          ],
          isDeleted: false,
        }
      : { isDeleted: false };
    const products = await productModel.find(searchQuery);
    return res.status(200).send({ status: true, data: products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    const product = await productModel.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true }
    );
    if (product) {
      return res
        .status(200)
        .send({ status: true, msg: "successful", data: product });
    }
    return res.status(400).send({ status: false, msg: "product not exist" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    const product = await productModel.findOneAndUpdate(
      { _id: productId },
      { isDeleted: true },
      { new: true }
    );
    if (product) {
      return res
        .status(200)
        .send({ status: true, msg: "successful", data: product });
    }
    return res.status(400).send({ status: false, msg: "product not exist" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const retrieveProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    const product = await productModel.findOneAndUpdate(
      { _id: productId },
      { isDeleted: false },
      { new: true }
    );
    if (product) {
      return res
        .status(200)
        .send({ status: true, msg: "successful", data: product });
    }
    return res.status(400).send({ status: false, msg: "product not exist" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createProduct,
  searchProduct,
  updateProduct,
  deleteProduct,
  retrieveProduct,
};
