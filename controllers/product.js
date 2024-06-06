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
    // You can also add pagination to limit the number of products returned
    // productsPromise = Product.find().limit(10).skip(0); // Limit to 10 products and skip the first 0 products
    // productsPromise = Product.find({ type: 'sellable' });

  }
  productsPromise
    .then((products) => {
      // Modify the response to include image path or URL
      const productsWithImages = products.map((product) => ({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl, // Include the image path or URL
      }));

      // Render an EJS view with the product data
      // res.json(productsWithImages);
      // res.json(products);
      let username = req.user ? req.user.username : null;
      let profilePic = req.user ? req.user.profilePic : null;

      // res.render('product/all-products', { category, products: productsWithImages, pageTitle: 'All Products', categoryTitle: category});
      res.render('./product/all-Products.ejs', {
        category, products: productsWithImages,
        pageTitle: 'All Products',
        path: '/products',
        categoryTitle: category,
        username: username, profilePic: profilePic
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
      let username = req.user ? req.user.username : null;
      let profilePic = req.user ? req.user.profilePic : null;

      // Render an EJS view with the product data
      res.render('product/product-details', {
        product,
        path: '/products',
        pageTitle: product.name,
        username: username, profilePic: profilePic
      });
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
      // You may want to create an 'error.ejs' view to handle error messages
    });
};

