const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // sending response
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  // fetching the data sent from request form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  // ! cooler way you can do it with sequelize
  // ? createProduct is a 'special method' created by sequelize because association between user and products
  req.user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  /*  
    ! less cooler but also less confusing way
    Product.create({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
      userId: req.user.id // association between product - user
    })
      .then((result) => {
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err);
      }); */
};

exports.getEditProduct = (req, res, next) => {
  // checking query params (extra data in url)
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }

  // extracting the product through the id
  const prodId = req.params.productId;
  // ! productId is the variable segment in the route

  // ! getProducts is a 'special method' created by sequelize from the association between users and products
  // ? the reason we use this is because we want to fetched the products that belongs to the current user only
  // ? that way the user won't have the ability to edit other user's products
  // ! getProducts returns an array
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      // sending response
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  /* 
    ! this code is still ok, but it will give the user a leeway to edit other user's products
    Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      // sending response
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    }); */
};

exports.postEditProduct = (req, res, next) => {
  // fetching the data sent from request form
  // ! this time with the product id
  const prodId = req.body.productId; // productId is the name attribute in the input tag
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;

      /* 
      saving the change, 
      if the product doesn't exist yet it will create a new one
      if the product already exist it will update the existing product
    */
      return product.save();
      /*  
      ? return it so we won't have to nest the promises after save()
      ? and instead using another then after this then we currently in
    */
    })
    .then((result) => {
      console.log("updated!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/products");
    });
};

exports.getProducts = (req, res, next) => {
  /* 
   ! getProducts is a 'special method' created by sequelize from the association between users and products
   ? the reason we use this is because we want to fetched the products that belongs to the current user only
   ! getProducts returns an array 
   */
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  /* 
    ! the old approach, with this code we will display all user's added product
    Product.findAll()
    ! findAll() returns an array
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    }); */
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {
      id: prodId,
    },
  })
    .then((result) => {
      console.log("deletion succeded!");
    })
    .catch((err) => {
      console.log(err);
    });

  /* 
    ! alternative code:
    Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
  */
  res.redirect("/admin/products");
};
