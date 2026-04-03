require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Product = require('./schema/productModel')

const app = express()

// Middleware
app.use(express.json())

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))

// 🟢 CREATE
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body)
        await product.save()
        res.send(product)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// 🔵 GET ALL
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        res.send(products)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// 🟡 GET ONE
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).send('Product not found')
        }

        res.send(product)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// 🟠 UPDATE
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!product) {
            return res.status(404).send('Product not found')
        }

        res.send(product)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// 🔴 DELETE
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).send('Product not found')
        }

        res.send('Product deleted')
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// ✅ Server start
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})