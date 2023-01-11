const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`)
.then(() => console.log('Database Connected!'))

module.exports = mongoose;