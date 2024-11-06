const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// criar uma função que verifica se tem um usuario de email admin@admin.com e senha admin, se não tiver ele cria
function criarUsuarioAdmin() {
    Usuario.findOne({ email: 'admin@admin.com' }).lean().then((usuario) => {
        if (!usuario) {
            const novoUsuario = new Usuario({
                nome: 'Admin',
                email: 'admin@admin.com',
                eAdmin: 1,
                senha: 'admin'
            });

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                    if (erro) {
                        req.flash('error_msg', 'Houve um erro durante o salvamento do usuário');
                        res.redirect('/');
                    }
                    novoUsuario.senha = hash;

                    novoUsuario.save().then(() => {
                        console.log('Usuário admin criado');
                    }).catch((err) => {
                        console.log('Erro ao criar usuário admin');
                    });
                });
            });
        }
    }).catch((err) => {
        console.log('Erro ao criar usuário admin');
    });
}

criarUsuarioAdmin();

router.get('/registro', (req, res) => {
    res.render('usuario/registro');
})

router.post('/registro', (req, res) => {
    var erros = [];
    console.log(req.body.senha);

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: 'As senhas são diferentes' });
    }
    if (req.body.senha.length < 4) {
        erros.push({ texto: 'Senha muito curta' });
    }
    if (!req.body.nome || req.body.nome == '' || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' });
    }
    if (!req.body.email || req.body.email == '' || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'Email inválido' });
    }
    Usuario.findOne({ email: req.body.email }).then((usuario) => {
        if (usuario) {
            erros.push({ texto: 'Email já cadastrado' });
        }
        if (erros.length > 0) {
            console.log(erros);
            res.render('usuario/registro', { erros: erros });
            return;
        }
        const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        });

        bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if (erro) {
                    req.flash('error_msg', 'Houve um erro durante o salvamento do usuário');
                    res.redirect('/');
                }
                novoUsuario.senha = hash;

                novoUsuario.save().then(() => {
                    req.flash('success_msg', 'Usuário criado com sucesso');
                    res.redirect('/');
                }).catch((err) => {
                    req.flash('error_msg', 'Erro ao criar usuário, tente novamente');
                    res.redirect('/usuarios/registro');
                });
            });
        });
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno');
        res.redirect('/');
    });
});

router.get('/login', (req, res) => {
    res.render('usuario/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'Deslogado com sucesso');
        res.redirect('/');
    });
});


module.exports = router;