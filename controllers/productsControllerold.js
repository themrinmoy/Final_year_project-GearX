// ProductController.js

const Product = require('../models/Product');

const productController = {
  // index: (req, res) => {
  //   Product.find()
  //     .then((products) => {
  //       res.json(products);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching products:', error);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //     });
  // },
  index: async (req, res) => {
    try {
      const { category } = req.query;
      let products;

      if (category) {
        // If a category is specified, filter products by category
        products = await Product.find({ category });
      } else {
        // If no category is specified, retrieve all products
        products = await Product.find();
      }

      // Modify the response to include image path or URL
      const productsWithImages = products.map(product => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl, // Include the image path or URL
      }));

      // res.json(productsWithImages);
      res.render('product/index', { products: productsWithImages });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  productDetails: (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
      .then((product) => {
        if (!product) {
          return res.status(404).render('error', { message: 'Product not found' });
          // You may want to create an 'error.ejs' view to handle error messages
        }

        // Render an EJS view with the product data
        res.render('product/product-details', { product });
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
        // You may want to create an 'error.ejs' view to handle error messages
      });
  },




  // productsByCategory: async (req, res) => {
  //   try {
  //     const { category } = req.params;
  //     let products;

  //     if (category) {
  //       // If a category is specified, filter products by category
  //       products = await Product.find({ category });
  //     } else {
  //       // If no category is specified, retrieve all products
  //       products = await Product.find();
  //     }

  //     // Modify the response to include image path or URL
  //     const productsWithImages = products.map(product => ({
  //       _id: product._id,
  //       name: product.name,
  //       description: product.description,
  //       price: product.price,
  //       category: product.category,
  //       imageUrl: product.imageUrl, // Include the image path or URL
  //     }));

  //     // Render an EJS view with the product data
  //     // res.json(productsWithImages);

  //     res.render('product/all-products', { category, products: productsWithImages, pageTitle: 'All Products'});
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     res.status(500).render('error', { message: 'Internal Server Error' });
  //     // You may want to create an 'error.ejs' view to handle error messages
  //   }
  // },
};


exports.productsByCategory2 = (req, res, next) => {
  const { category } = req.params;

  let productsPromise;

  if (category) {
    // If a category is specified, filter products by category
    productsPromise = Product.find({ category });
  } else {
    // If no category is specified, retrieve all products
    productsPromise = Product.find();
  }

  productsPromise
    .then((products) => {
      // Modify the response to include image path or URL
      const productsWithImages = products.map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl, // Include the image path or URL
      }));

      // Render an EJS view with the product data
      // res.json(productsWithImages);

      res.render('product/all-products', { category, products: productsWithImages, pageTitle: 'All Products'});
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
      // You may want to create an 'error.ejs' view to handle error messages
    });
};

// module.exports = ProductController;
