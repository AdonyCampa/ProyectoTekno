const { Router } = require('express');
const uploadMiddleware = require('../helpers/handleStorage');
const { createStorage } = require('../controllers/storage');

const router = Router();



// Subir imagen  localhost:4000/api/storage/
router.post( '/', uploadMiddleware.single("myfile"), createStorage);


module.exports = router;  