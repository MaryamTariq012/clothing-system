const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect karein
mongoose.connect('mongodb://localhost:27017/ClothingDB')
    .then(() => console.log("✅ Clothing Database Connected"))
    .catch(err => console.log(err));

// Gents Clothes Schema
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String // Shirt, Pant, Kurta etc.
});

const Product = mongoose.model('Product', ProductSchema);

// Routes
app.get('/api/products/all', async (req, res) => {
    const data = await Product.find();
    res.json(data);
});

app.post('/api/products/add', async (req, res) => {
    const newItem = new Product(req.body);
    await newItem.save();
    res.send("Product Added!");
});

app.delete('/api/products/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Product Deleted!");
});

app.listen(5000, () => console.log("🚀 Server running on Port 5000"));