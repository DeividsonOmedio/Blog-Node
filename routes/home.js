const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Postagens')
const Postagem = mongoose.model('postagens');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');


router.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({ data: "desc" }).lean().then((postagens) => {
        res.render('home/home', { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar postagens")
        res.redirect('/404')
    })
})

router.get('/', (req, res) => {

    router.get('/404', (req, res) => {
        res.send('Erro 404')
    })
})

router.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        console.log('chegou')
        console.log(postagem)
        res.render('home/postagem', { postagem: postagem })
    })
});

router.get('/categoria/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        console.log('chegou')
        console.log(categoria)
        Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {
            console.log('chegou')
            console.log(postagens)
            res.render('home/categoria', { postagens: postagens, categoria: categoria })
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao listar postagens')
            res.redirect('/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar a página desta categoria')
        res.redirect('/')
    })
});



module.exports = router;