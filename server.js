const express = require('express');
require('dotenv').config()
const path = require('path');
const pool = require('./database');
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const session = require('express-session');
const { createHash, randomBytes } = require('crypto');
const port=process.env.port
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/login', async (req,res)=>{
    const {email,senha} = req.body
    const query=`
    SELECT * FROM usuario
    WHERE email = $1
    AND 
    senha = $2
    `
    const result = await pool.query(query,[email,senha])
    if(result.rowCount>0){
        res.send(`
            <script>
            alert("login feito com sucesso!")
            window.location.href='/inicio'
            </script>
            `)
    }
    else{
        res.send(`
            <script>
                alert("usuário não encontrado.")
                window.location.href='/'
                </script>
            `)
    }
})

app.get('/inicio',(req,res)=>{
    res.render('inicio')
})

app.get('/register',(req,res)=>{
    res.render('registro')
})

app.post('/register',async (req,res)=>{
    const {nome,email,senha} = req.body
    const query1=`
    SELECT * FROM usuario
    WHERE email=$1
    `
    const result=await pool.query(query1,[email])
    if(result.rowCount>0){
        res.send(`
            <script>
            alert("Email já cadastrado!")
            window.location.href='/register'
            </script>
            `)
    }
    else{
        const query2=`
        INSERT INTO usuario(nome,email,senha)
        VALUES($1,$2,$3)
        `
        const result1=await pool.query(query2,[nome,email,senha])
        if(result1.rowCount>0){
            res.send(`
                <script>
                alert("usuario cadastrado!")
                window.location.href='/inicio'
                </script>
                `)
        } 
        else{
                      res.send(`
                <script>
                alert("erro ao cadastrar")
                window.location.href='/register'
                </script>
                `)  
        }
    }
})


app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})