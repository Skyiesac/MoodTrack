require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const app = express();

app.use(express.json());

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((error) => console.error('Database connection failed:', error));

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});