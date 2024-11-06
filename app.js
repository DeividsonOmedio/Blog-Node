//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParesr = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const path = require('path');
const app = express();
const admin = require('./routes/admin');
const home = require('./routes/home');
const router = express.Router();
const usuario = require('./routes/usuario');

const mongoose = require('mongoose');
require('./models/Categoria');
const Categoria = mongoose.model('categorias');

const passport = require('passport');
require('./config/auth')(passport);

// Configurações
    // Sessão
    app.use(session({
        secret : 'cursodenode',
        resave: true,
        saveUninitialized: true
    }));

app.use(passport.initialize());
app.use(passport.session());
    // Flash
    app.use(flash());
    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        console.log(req.user);
        next();
    });
    // Body Parser
    app.use(bodyParesr.urlencoded({extended: true}));
    app.use(bodyParesr.json());

// Configurando o Handlebars como engine de visualização e registrando o helper `eq`
const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        eq: function (a, b) {
            return a.toString() === b.toString();
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true      
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log('Conectado ao mongo');
    }).catch((err) => {
        console.log('Erro ao se conectar: ' + err);
    }); 


    // Public
    app.use(express.static(path.join(__dirname, 'public')));
// Rotas
// Middleware para carregar categorias em todas as views
app.use((req, res, next) => {
    Categoria.find().lean().sort({ nome: 'asc' })
        .then((categorias) => {
            res.locals.categorias = categorias;
            next();
        })
        .catch((err) => {
            req.flash('error_msg', 'Erro ao carregar categorias');
            res.locals.categorias = [];
            next();
        });
});

    app.use('/', home);
    app.use('/admin', admin);
app.use('/usuarios', usuario);


// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Servidor rodando');
});