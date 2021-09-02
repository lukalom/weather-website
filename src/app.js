const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express()
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebats engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath) 

// setup static directory
app.use(express.static('public')) 

app.get('', (req, res) => {
    res.render('index', {
        title:'Weather',
        name: 'luka'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'lomkaca'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help', 
        helpText: 'This is some helpful text.',
        name: 'lukexa'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    // req.query ვნახულობთ ურლში გადაცემულ არგუმენტებს
    // console.log(req.query)

    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name:'Lomkaca',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'lomkaca',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('We are connected on port 3000')
})