const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categData = await Category.findAll({include: [{ model: Product}]});
    res.status(200).json(categData)
  }
  catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
try {
  const categData = await Category.findByPk(req.params.id, {
    include: [{model: Product}]
  });
  res.status(200).json(categData)
}
catch(err) {
  res.status(500).json(err)
}
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categData = await Category.create(req.body);
    res.status(200).json(categData)
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{ 
    const categData = await Category.update({
      category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(categData)
  }
catch (err) {
  res.status(500).json(err)
}
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const categData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!categData) {
      res.status(404).json({message: 'No category found with this id'})
      return;
    }
    res.status(200).json(categData);
  }
  catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
