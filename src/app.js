const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const { Op } = require("sequelize")
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id, ClientId: req.profile.id}})
    if(!contract) return res.status(404).end()
    res.json(contract)
})

app.get('/contracts',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const contracts = await Contract.findAll({where: {ClientId: req.profile.id, status: {[Op.not]: 'terminated'}}})
    res.json(contracts)
})

app.get('/jobs/unpaid',getProfile ,async (req, res) =>{
    const { Job, Contract } = req.app.get("models");
    const jobs = await Job.findAll({
        include: [{
            model: Contract,
            required: true,
            where: {
                [Op.or]: [
                    { ContractorId: req.profile.id },
                    { ClientId: req.profile.id }
                ],
                status: "in_progress"
            }
        }],
        where: {
            paid: true
        }
    });
    return res.status(200).json(jobs);
})

module.exports = app;
