const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try{
    const productData = await Product.findAll({include: [{model: Category, Tag}]});
    res.status(200).json(productData);
  }
  catch (err) {res.status(500).json(err)}
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category, Tag}]
    });
    res.status(200).json(productData)
  }
  catch (err) {res.status(500).json(err)}
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      const productData = await Product.create(req.body);
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: productData.id,
            tag_id,
          };
        });
        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
        res.status(201).json(productTagIds)
      } else {
      // if no product tags, just respond
      res.status(200).json(productData);
      }
     } catch (err) {
        console.log(err);
        res.status(400).json(err);
     }
    });


// update product
router.put('/:id', async (req, res) => {
  try {
    
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
   
    if (req.body.tagIds) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
 
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      const updProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);

      res.status(201).json(updProductTags);
    } else {
      
      res.status(200).json(`Nice! Product #${req.params.id} has now been updated.`)
    };
  } catch (err) {
    res.status(400).json(err);
  };
});
router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    const proData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!proData) {
      res.status(404).json({message: 'No Product found with this id'})
      return;
    }
    res.status(200).json(proData);
  }
  catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
