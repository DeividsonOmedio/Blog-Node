//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParesr = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const path = require('path');
const app = express();
const admin = require('./routes/admin');
const home = require('./routes/home');

// Configurações
    // Sessão
    app.use(session({
        secret : 'cursodenode',
        resave: true,
        saveUninitialized: true
    }));
    // Flash
    app.use(flash());
    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
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
    app.use('/', home);
    app.use('/admin', admin);

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Servidor rodando');
});