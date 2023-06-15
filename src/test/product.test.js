let chai = require("chai");
const mongoose = require("mongoose");
const productModel = require("../model/productModel.js");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);
const app = require("../index.js");

describe("Product", () => {
  const mockData = {
    name: "test_name",
    description: "test_description",
    price: 100,
    varient: [
      {
        name: "test_varient_name_1",
        SKU: "SKU_1",
        cost: 440,
        stockCount: 50,
      },
      {
        name: "test_varient_name_2",
        SKU: "SKU_2",
        cost: 460,
        stockCount: 30,
      },
    ],
  };

  const mockUpdatedData = {
    name: "test_name_updated",
    description: "test_description_updated",
    price: 100,
    varient: [
      {
        name: "test_varient_name_1_updated",
        SKU: "SKU_1_updated",
        cost: 420,
        stockCount: 40,
      },
      {
        name: "test_varient_name_2_updated",
        SKU: "SKU_2_updated",
        cost: 470,
        stockCount: 70,
      },
    ],
  };

  function verifyApiData(response, status, isProductUpdated) {
    const productResponse = response.body.data;
    expect(response).to.have.status(status);
    if (isProductUpdated) {
      expect(productResponse.name).to.equal(mockUpdatedData.name);
      expect(productResponse.description).to.equal(mockUpdatedData.description);
      expect(productResponse.varient.length).to.equal(
        mockUpdatedData.varient.length
      );
      expect(productResponse.varient[0].name).to.equal(
        mockUpdatedData.varient[0].name
      );
      expect(productResponse.varient[0].SKU).to.equal(
        mockUpdatedData.varient[0].SKU
      );
      expect(productResponse.varient[0].cost).to.equal(
        mockUpdatedData.varient[0].cost
      );
      expect(productResponse.varient[0].stockCount).to.equal(
        mockUpdatedData.varient[0].stockCount
      );
      expect(productResponse.varient[1].name).to.equal(
        mockUpdatedData.varient[1].name
      );
      expect(productResponse.varient[1].SKU).to.equal(
        mockUpdatedData.varient[1].SKU
      );
      expect(productResponse.varient[1].cost).to.equal(
        mockUpdatedData.varient[1].cost
      );
      expect(productResponse.varient[1].stockCount).to.equal(
        mockUpdatedData.varient[1].stockCount
      );
    } else {
      expect(productResponse.name).to.equal(mockData.name);
      expect(productResponse.description).to.equal(mockData.description);
      expect(productResponse.varient.length).to.equal(mockData.varient.length);
      expect(productResponse.varient[0].name).to.equal(
        mockData.varient[0].name
      );
      expect(productResponse.varient[0].SKU).to.equal(mockData.varient[0].SKU);
      expect(productResponse.varient[0].cost).to.equal(
        mockData.varient[0].cost
      );
      expect(productResponse.varient[0].stockCount).to.equal(
        mockData.varient[0].stockCount
      );
      expect(productResponse.varient[1].name).to.equal(
        mockData.varient[1].name
      );
      expect(productResponse.varient[1].SKU).to.equal(mockData.varient[1].SKU);
      expect(productResponse.varient[1].cost).to.equal(
        mockData.varient[1].cost
      );
      expect(productResponse.varient[1].stockCount).to.equal(
        mockData.varient[1].stockCount
      );
    }
  }

  before(async () => {
    mongoose
      .connect(
        "mongodb+srv://rupalikumari:JInaXFAjWKId5h19@cluster0.8qeleal.mongodb.net",
        { useNewUrlParser: true }
      )
      .then(() => {
        console.log("You have connected with your mongoDB");
      })
      .catch((err) =>
        console.log("There is some problem in mongoose connection", {
          error: err,
        })
      );
  });

  after(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await productModel.deleteMany({});
  });

  it("should create and get data properly", async () => {
    const newData = new productModel(mockData);
    const product = await newData.save();
    const response = await productModel.findById(product._id);
    expect(response.name).to.equal("test_name");
    expect(response.description).to.equal("test_description");
    expect(response.price).to.equal(100);
    expect(response.varient.length).to.equal(2);
    expect(response.varient[0].name).to.equal("test_varient_name_1");
    expect(response.varient[0].SKU).to.equal("SKU_1");
    expect(response.varient[0].cost).to.equal(440);
    expect(response.varient[0].stockCount).to.equal(50);
    expect(response.varient[1].name).to.equal("test_varient_name_2");
    expect(response.varient[1].SKU).to.equal("SKU_2");
    expect(response.varient[1].cost).to.equal(460);
    expect(response.varient[1].stockCount).to.equal(30);
  });

  describe("POST /product", () => {
    it("should create a new product", async () => {
      const response = await chai.request(app).post("/product").send(mockData);
      verifyApiData(response, 201);
    });
  });

  describe("PUT /product/:id", () => {
    it("should update the product using id", async () => {
      const dummyData = new productModel(mockData);
      const product = await dummyData.save();
      const res = await chai
        .request(app)
        .put(`/product/${product._id}`)
        .send(mockUpdatedData);
      verifyApiData(res, 200, true);
    });
  });

  describe("DELETE /product/:id", () => {
    it("should delete a product using id", async () => {
      const dummyData = new productModel(mockData);
      const product = await dummyData.save();
      const res = await chai.request(app).delete(`/product/${product._id}`);
      expect(res).to.have.status(200);
      expect(res.body.msg).to.equal("successful");
      expect(res.body.data.isDeleted).to.equal(true);
    });
  });

  describe("RETRIEVE /product/:id", () => {
    it("should retrieve the product using id", async () => {
      const dummyData = new productModel(mockData);
      const product = await dummyData.save();
      const deleteProduct = await chai
        .request(app)
        .delete(`/product/${product._id}`);
      expect(deleteProduct).to.have.status(200);
      expect(deleteProduct.body.data.isDeleted).to.equal(true);
      const retrieveProduct = await chai
        .request(app)
        .post(`/product/retrieve/${product._id}`);
      expect(retrieveProduct).to.have.status(200);
      expect(retrieveProduct.body.data.isDeleted).to.equal(false);
    });
  });

  describe("SEARCH /product", () => {
    it("should search product by name description and varient name", async () => {
      const dummyData = new productModel(mockData);
      await dummyData.save();

      const searchByName = await chai
        .request(app)
        .get(`/product`)
        .query({ search: "test_name" });
      expect(searchByName).to.have.status(200);
      expect(searchByName.body.data[0].name).to.equal("test_name");

      const searchByDescription = await chai
        .request(app)
        .get(`/product`)
        .query({ search: "test_description" });
      expect(searchByDescription).to.have.status(200);
      expect(searchByDescription.body.data[0].description).to.equal(
        "test_description"
      );

      const searchByVarient = await chai
        .request(app)
        .get(`/product`)
        .query({ search: "test_varient_name_1" });
      expect(searchByVarient).to.have.status(200);
      expect(searchByVarient.body.data[0].varient[0].name).to.equal(
        "test_varient_name_1"
      );
    });
  });
});

// npx mocha product.test.js
