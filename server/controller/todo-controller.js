const knex = require("../database/connection");

async function getTodos(req, res) {
  const { projectId } = req.params;
  const { organization_id } = req.user;

  const todos = await knex("todos").where({project_id: projectId, organization_id});
  res.send(todos);
}

async function createTodo(req,res) {
    // user_id: is the Id of the user that is assigned to this todo, null if no assignment
    const {title, order, user_id, project_id} = req.body;
    const { organization_id } = req.user;

    const [todo] = await knex("todos").insert({title, order, user_id, project_id, organization_id}).returning("*");

    res.status(201).send(todo);
}

async function updateTodo(req,res) {
    const {id} = req.params;
    const {organization_id} = req.user;
    const updateFields = req.body;

    const [todo] = await knex("todos").where({id, organization_id}).update(updateFields).returning("*");

    res.send(todo);
}

async function deleteTodo(req, res){
    const {id} = req.params;
    const { organization_id } = req.user;

    await knex("todos").where({id, organization_id}).del();
    res.status(200).send("Deleted!")
}

function addErrorReporting(func, message) {
    return async function(req, res) {
        try {
            return await func(req, res);
        } catch(err) {
            console.log(`${message} caused by: ${err}`);

            // Not always 500, but for simplicity's sake.
            res.status(500).send(`Opps! ${message}.`);
        } 
    }
}

const toExport = {
    getTodos: { method: getTodos, errorMessage: "Could not get todos" },
    createTodo: { method: createTodo, errorMessage: "Could not create todo" },
    updateTodo: { method: updateTodo, errorMessage: "Could not update todo" },
    deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;