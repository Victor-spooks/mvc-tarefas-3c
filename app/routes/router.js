var express = require("express");
var router = express.Router();

const { tarefasModel } = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

moment.locale('pt-br');

router.get("/", async function (req, res) {
    res.locals.moment = moment;
    try {
        const linhas = await tarefasModel.findAll();
        res.render("pages/index", { linhasTabela: linhas });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao carregar tarefas");
    }
});

router.get("/cadastro", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro", {
        tituloAba: "Cadastro de tarefa",
        tituloPagina: "Nova Tarefa",
        tarefa: { id_tarefa: 0, nome_tarefa: "", prazo_tarefa: "", situacao_tarefa: 1 },
        erros: []
    });
});

router.get("/alterar", async (req, res) => {
    res.locals.moment = moment;
    const id = parseInt(req.query.id, 10);

    if (isNaN(id)) {
        return res.status(400).send("ID inválido");
    }

    try {
        const tarefa = await tarefasModel.findById(id);

        if (!tarefa || tarefa.length === 0) {
            return res.status(404).send("Tarefa não encontrada");
        }

        res.render("pages/cadastro", {
            tituloAba: "Edição de tarefa",
            tituloPagina: "Alterar Tarefa",
            tarefa: tarefa[0],
            erros: []
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Erro ao buscar tarefa");
    }
});

router.post(
    "/cadastro",
    [
        body("id").optional().isInt(),

        body("tarefa")
            .trim()
            .isLength({ min: 5, max: 45 })
            .withMessage("Deve conter entre 5 e 45 caracteres."),

        body("prazo")
            .notEmpty().withMessage("O prazo é obrigatório.")
            .isISO8601().withMessage("Data inválida.")
            .custom((value) => {
                const hoje = new Date();
                const prazo = new Date(value);

                hoje.setHours(0, 0, 0, 0);

                if (prazo < hoje) {
                    throw new Error("O prazo deve ser hoje ou no futuro.");
                }
                return true;
            }),

        body("situacao")
            .isInt({ min: 0, max: 4 })
            .withMessage("A situação deve ser um número entre 0 e 4.")
    ],
    async (req, res) => {
        res.locals.moment = moment;

        const erros = validationResult(req);

        const objJson = {
            id: parseInt(req.body.id || 0),
            nome: req.body.tarefa,
            prazo: req.body.prazo,
            situacao: parseInt(req.body.situacao)
        };

        if (!erros.isEmpty()) {
            return res.render("pages/cadastro", {
                tituloAba: objJson.id === 0 ? "Cadastro de tarefa" : "Edição de tarefa",
                tituloPagina: objJson.id === 0 ? "Nova Tarefa" : "Alterar Tarefa",
                tarefa: {
                    id_tarefa: objJson.id,
                    nome_tarefa: objJson.nome,
                    prazo_tarefa: objJson.prazo,
                    situacao_tarefa: objJson.situacao
                },
                erros: erros.array()
            });
        }

        try {
            if (objJson.id === 0) {
                await tarefasModel.create(objJson);
            } else {
                await tarefasModel.update(objJson);
            }

            res.redirect("/");
        } catch (erro) {
            console.log(erro);

            return res.render("pages/cadastro", {
                tituloAba: "Erro",
                tituloPagina: "Erro ao salvar",
                tarefa: {
                    id_tarefa: objJson.id,
                    nome_tarefa: objJson.nome,
                    prazo_tarefa: objJson.prazo,
                    situacao_tarefa: objJson.situacao
                },
                erros: [{ msg: "Erro interno ao salvar tarefa." }]
            });
        }
    }
);

module.exports = router;

