var express = require("express");
var router = express.Router();

const { tarefasModel } = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { tarefasController } = require("../controllers/tarefasController");

moment.locale('pt-br');

router.get("/", async function (req, res) {
    tarefasController.listarTarefas(req,res);
    
});

module.exports = router;