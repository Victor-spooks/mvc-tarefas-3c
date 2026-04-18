const pool = require("../../config/pool_conexoes");
const tarefasModel = {

    findAll: async () => {
        try {
            const [linhas] = await pool.query("select * from tarefas where status_tarefa = 1");
            return linhas;
        } catch (erro) {
            throw erro;
        }
    },
    findById: async (id) => {
        try {
            const [linhas] = await pool.query(
                "select * from tarefas where status_tarefa = 1 and id_tarefa = ?",
                [id]);
            return linhas;
        } catch (erro) {
            return erro;
        }
    },
    create: async (dados) => {
        try {
            const [resultInsert] = await pool.query(
                "insert into tarefas(`nome_tarefa`,`prazo_tarefa`, " +
                "`situacao_tarefa`) values(?,?,?)",
                [dados.nome, dados.prazo, dados.situacao]);
            return resultInsert;
        } catch (erro) {
            return erro;
        }

    },

    update: async (dados) => {
        try {
            const [resulUpdate] = await pool.query(
                "update tarefas set `nome_tarefa`= ?,`prazo_tarefa`= ?,  " +
                "`situacao_tarefa`= ? where id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]);
            return resulUpdate;
        } catch (erro) {
            return erro;
        }
    },

    deleteById: async (id) => {
        try {
            const [result] = await pool.query(
                "DELETE FROM tarefas WHERE id_tarefa = ?",
                [id]
            );
            return result;
        } catch (erro) {
            console.error("Erro no deleteById:", erro);
            throw erro;
        }
    }

};

module.exports = { tarefasModel }