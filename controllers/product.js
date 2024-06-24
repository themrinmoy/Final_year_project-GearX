// ProductController.js
// conrollers/ProductController.js

const Product = require('../models/Product');


exports.productsByCategory = (req, res, next) => {
  const { category } = req.params;

  let productsPromise;

  if (category) {
    // If a category is specified, filter products by category
    productsPromise = Product.find({ category, type: 'sellable'});
  } else {
    // If no category is specified, retrieve all products
    // productsPromise = Product.find();
    // You can also add pagination to limit the number of products returned
    // productsPromise = Product.find().limit(10).skip(0); // Limit to 10 products and skip the first 0 products
    productsPromise = Product.find({ type: 'sellable' });

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


      // res.render('product/all-products', { category, products: productsWithImages, pageTitle: 'All Products', categoryTitle: category});
      res.render('product/all-Products.ejs', {
        category, products: productsWithImages,
        pageTitle: 'All Products',
        path: '/products',
        categoryTitle: category,
      });

    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      res.redirect(`/products?warning=${error.message}`);
      // You may want to create an 'error.ejs' view to handle error messages
    });
};


exports.productDetails = (req, res) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {

        return res.redirect('/products?warning=Product not found');
      }


      // Render an EJS view with the product data
      res.render('product/product-details', {
        product,
        path: '/products',

      });
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
      res.redirect(`/products?error=Product ID not found`);
      // res.redirect(`/products?warning=${error.message}`);
      // You may want to create an 'error.ejs' view to handle error messages
    });
};

