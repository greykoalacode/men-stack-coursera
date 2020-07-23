const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourite');
const authenticate = require('../authenticate');
const user = require('../models/user');
const cors = require('./cors');
const Dishes = require('../models/dishes');
const { init } = require('../models/user');
var ObjectID = require('mongodb').ObjectID;

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());


favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next ) => {
    Favourites.find({})
    .populate('user')
    .then((favourites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites);
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req,res, next) => {
    const List = req.body.ids;
    // console.log(List);
    // const dish = await Dishes.findById(req.body[0])
    // .select('_id')
    // res.json(dish);
    // Dishes.findById(req.body[0])
    // .then(
    //     dishes => console.log(dishes)
    // )
    // .catch( err  => next(err));
    // const filterFunction = (dishId) => {
    //     Dishes.findById({_id: dishId })
    //     .then(
    //         dish => {
    //             filteredList.push(dish)
    //         }
    //     )
    //     .catch(err => next(err))
    // }
    const filteredList = await Promise.all(List.map(async each => {
        var Dish = await Dishes.findById({_id: each })
        
        return Dish;
        // return filteredList;
    }))
    // console.log(filteredList)

    Favourites.findOne({user: req.user._id})
    .then(
        favourite => {
            if(favourite != null){
                if(filteredList.some(each => {
                    return favourite.dishes.indexOf(each) >= 0
                })){
                    return res.send('Already Added');
                }
                favourite.dishes = [...favourite.dishes, ...filteredList];
                favourite.save()
                .then(fav => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                })
                .catch(err => next(err));
            }
            else {
                Favourites
                .create({
                    user: req.user._id,
                    dishes: filteredList
                })
                .then(
                    favourite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    }
                )
            }
        }
    )
    // Favourites.findOneAndUpdate({user: req.user._id}, {dishes: filteredList},{upsert: true, new: true},(err, docs) => {
    //     if(err){
    //         return next(err)
    //     }
    //     res.json(docs)
    // } );
    // .then(
    //     fav => {
    //         res.json(fav)
    //     }
    // ).catch((err) => {
    //     return next(err);
    // })
    // Favourites.findOneAndUpdate({user: req.user._id}, {
    //     $set: filteredList
    // }, {new: true});
    // Favourites.create({user: req.user._id, dishes: filteredList})
    // .then(
    //     dishes => {
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'application/json');
    //         res.json(dishes);
    //     }
    // )
    // .catch(err => next(err));
    // List.forEach(
    //     each => {
    //         Dishes.findById({_id: each})
    //         .then(
    //             dish => {
    //                 console.log(dish)
    //                 const fav = new Favourites({
    //                     user: req.user._id,
    //                     dishes: []
    //                 });
    //                 fav.dishes.push(dish);

    //                 fav.save().then((err, doc) => {
    //                     if(err) return next(err)
    //                     res.statusCode = 200;
    //                     res.setHeader('Content-Type', 'application/json');
    //                     res.json({doc})
    //                 })
    //             })
    //         })

    //                 Favourites.create({user: req.user._id, dishes: dish})
    //                 .then(
    //                     dishes => {
    //                         res.statusCode = 200;
    //                         res.setHeader('Content-Type', 'application/json');
    //                         res.json(dishes);
    //                     }
    //                 )
    //                 .catch(err => next(err));
    //             }
    //         )
    //     }
    // )
    // Favourites.create({req.body})
    // .populate('dishes')
    // .then(dishes => {
    //     res.json(dishes);
    // })
    // .catch(err => next(err));
    // for (var key in List) {
    //     let dishId = List[key];
    //     Dishes.findById(dishId , (err, docs) => {
    //         if(err){
    //             err = new Error("Can't add random ids");
    //             err.status = 404;
    //             return next(err);
    //         }
    //         Favourites.create(docs)
    //         .populate('dishes')
    //         .then(favourites => {
    //             res.statusCode = 200;
    //             res.setHeader('Content-Type', 'application/json');
    //             res.json(favourites);
    //         }, err =>  next(err))
    //         .catch(err => next(err));
    //     })

    // } 
    
});


module.exports = favouriteRouter;