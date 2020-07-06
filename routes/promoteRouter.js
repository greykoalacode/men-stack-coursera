const express = require('express');
const bodyParser = require('body-parser');

const promoteRouter = express.Router();
promoteRouter.use(bodyParser.json());

promoteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the promotions to you!')
})
.post((req, res, next) => {
    res.end(`Will add the promotion: ${req.body.name} with details: ${req.body.description}`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not available on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
})

promoteRouter.route('/:promoteId')
.get((req, res, next ) => {
    res.end(`Will send details of the promotion: ${req.params.promoteId} to you!`);
})
.post((req,res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /promotions/${req.params.promoteId}`);

})
.put((req,res, next) => {
    res.write(`Updating the promotion: ${req.params.promoteId} \n`);
    res.end(`Will update the promotion: ${req.body.name} with details: ${req.body.description}`)

})
.delete((req, res, next) => {
    res.end(`Deleting the promotion: ${req.params.promoteId}!`);
});

module.exports = promoteRouter;