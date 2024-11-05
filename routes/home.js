const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Página principal');
});

router.get('/list', (req, res) => {
    res.send('Lista de produtos');
});

module.exports = router;