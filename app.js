const express = require('express');
const morgon = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const apidDocs = require('./docs/apiDocs.json');
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB connected'))
.catch((err) => console.log(err));

const app = express();
app.use(morgon('dev'));

var ownMiddleware = (req, res, next) => {
    console.log('Middleware applied.');
    next();
}

app.use(ownMiddleware);
app.use(expressValidator())
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Add post routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/post/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.json(apidDocs);
});
app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        return res.status(403).json({
            error: "You are not loggedin."
        })
    }

    next();
});

app.listen(PORT, () => {
    console.log(`App is listen at ${PORT}`);
});