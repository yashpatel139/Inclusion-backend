
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_URI);
mongoose.connection.once('open', () => {
    console.log('mongodb connected successfully',);
});