// ProductController.js
// conrollers/ProductController.js

const Product = require('../models/Product');


exports.productsByCategory = (req, res, next) => {
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

      // res.render('product/all-products', { category, products: productsWithImages, pageTitle: 'All Products', categoryTitle: category});
      res.render('./product/all-Products.ejs', {
        category, products: productsWithImages,
        pageTitle: 'All Products',
        path: '/products',
        categoryTitle: category
      });

    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
      // You may want to create an 'error.ejs' view to handle error messages
    });
};


exports.productDetails = (req, res) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).render('error', { message: 'Product not found' });
        // You may want to create an 'error.ejs' view to handle error messages
      }

      // Render an EJS view with the product data
      res.render('product/product-details', {
        product,
        // path: '/products',
        pageTitle: product.name
      });
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
      // You may want to create an 'error.ejs' view to handle error messages
    });
};

