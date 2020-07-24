const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourite');
const authenticate = require('../authenticate');
const user = require('../models/user');
const cors = require('./cors');
const Dishes = require('../models/dishes');

const getDetailedDish = async (dbModel, array) => {
    const newDetailedList = await Promise.all(array.map(async each => {
        var eachDish = await dbModel.findById({_id: each })
        return eachDish;
    }))
    return newDetailedList;
}

const checkValidDish = (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(
        dish => {
            if(dish === null){
                err = new Error(`Dish with id ${req.params.dishId} does not exist`);
                err.status = 404;
                return next(err);
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                next();
            }
        }
    )
}


const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());


favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next ) => {
    Favourites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then(favourites => {
        res.status(200).send(favourites);
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req,res, next) => {
    const List = req.body;
    const filteredList = await getDetailedDish(Dishes, List);
    
    Favourites.findOne({user: req.user._id})
    .then(
        async favourite => {
            if(favourite != null){
                let newList = List.filter((dish) => {
                    return !favourite.dishes.includes(dish)
                });
                const newFilteredList = await getDetailedDish(Dishes, newList);
                // Promise.all(newList.map(async each => {
                //     var Dish = await Dishes.findById({_id: each })
                //     return Dish;
                // }))
                favourite.dishes.push(...newFilteredList);
                favourite.populate('user')
                .save()
                .then(fav => {
                    res.status(200).send(fav);
                })
                .catch(err => next(err));
            }
            else {
                Favourites.create({ user: req.user._id, dishes: filteredList })
                .then(
                    favourite => {
                        res.status(200).send(favourite);
                    }
                )
            }
        }
    )
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOneAndRemove({ user: req.user._id })
    .then(
        response => {
            res.status(200).send(response);
        }
    )
    .catch(err => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.post(cors.corsWithOptions, authenticate.verifyUser, checkValidDish, (req,res, next) => {
    Favourites.findOne({ user: req.user._id })
    .then(
        fav => {
            if(fav === null){
                Favourites.create({
                    user: req.user._id,
                    dishes: req.params.dishId
                })
                .then(
                    resp => {
                        res.status(200).send(resp);
                    }, err => next(err)
                )
            } else {
                if(!fav.dishes.includes(req.params.dishId)){
                    fav.dishes = [...fav.dishes, req.params.dishId];
                    fav.save()
                    .then(
                        resp => {
                            res.status(200).send(resp);
                        }
                    );
                } else {
                    err = new Error('Dish already exists');
                    err.status = 404;
                    return next(err);
                }
            }
        }, err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, checkValidDish, (req,res, next) => {
    Favourites.findOne({ user: req.user._id })
    .then(
        fav => {
            if(fav === null) {
                err = new Error('No Favourites exist for this user');
                err.status = 404;
                return next(err);
            } else {
                if(fav.dishes.includes(req.params.dishId)){
                    let dishIndex = fav.dishes.indexOf(req.params.dishId);
                    fav.dishes.splice(dishIndex, 1);
                    fav.save()
                    .then(
                        resp => {
                            res.status(200).send(resp);
                        }
                    )
                }
            }
        }
    )
});

module.exports = favouriteRouter;