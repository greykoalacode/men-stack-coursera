const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoteRouter = express.Router();

promoteRouter.use(bodyParser.json());

promoteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res, next) => {
    Promotions.find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promos);
        }, err => next(err))
        .catch(err => next(err));
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log('Dish created', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, err => next(err))
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not available on /promotions');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err));
})

promoteRouter.route('/:promoteId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res, next ) => {
    Promotions.findById(req.params.promoteId)
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promos);
        }, err => next(err))
        .catch(err => next(err));
})
.post((req,res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /promotions/${req.params.promoteId}`);

})
.put((req,res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoteId, {
        $set: req.body
    }, { new: true })
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, err => next(err))
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoteId)
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err));
});

module.exports = promoteRouter;