require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const { v4: uuid } = require('uuid');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(express.json());
app.use(helmet());
app.use(cors());


const addresses = [];

app.get('/address', (req, res) => {
    res.json(addresses);
});

app.post('/address', (req, res) => {
    const { firstName, lastName, address1, address2, city, state, zip } = req.body;

    // validation code here
    if (!firstName) {
        return res
        .status(400)
        .send('firstName required');
    }
    if (!lastName) {
        return res
        .status(400)
        .send('lastName required');
    }
    if (!address1) {
        return res
        .status(400)
        .send('address1 required');
    }
    if (!city) {
        return res
        .status(400)
        .send('city required');
    }
    if (!state) {
        return res
        .status(400)
        .send('state required');
    }
    if (!zip) {
        return res
        .status(400)
        .send('zip required');
    }
    if (state.length !== 2) {
        return res
          .status(400)
          .send('State must be 2 characters');
    }
    if (zip.length !== 5) {
        return res
          .status(400)
          .send('Zipcode must be 5 characters');
    }

    const id = uuid();
    const newAddress = {
        id,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip
    };

    addresses.push(newAddress);
    res.status(201).location(`http://localhost:8000/address/${id}`).json(newAddress);
});

app.delete('/address/:addressId', (req, res) => {

});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;