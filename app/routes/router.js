var express = require("express");
var router = express.Router();

const { tarefasModel } = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const { tarefasController } = require("../controllers/tarefasController");

moment.locale('pt-br');

router.get("/", tarefasController.listarTarefas);

router.get("/cadastro", tarefasController.exibirCadastro);

router.get("/alterar", tarefasController.exibirAlteracao);

router.post("/cadastro", tarefasController.validarFormCad, tarefasController.salvarTarefa);

router.post("/excluir", tarefasController.excluirTarefa);

module.exports = router;