const knex = require("../database/connection");

/**
 * Create project
 * @param {*} req Request
 * @param {*} res Response
 */
async function createProject(req, res) {
    const {name} = req.body;
    const {organization_id} = req.user;

    if(!name) return res.status(400).send("Project name required!");

    const [project] = await knex("projects").insert({name, organization_id}).returning("*");

    res.status(200).send(project);
}

/**
 * Get project
 * @param {*} req Request
 * @param {*} res Response
 */
async function getProjects(req, res) {
    const {organization_id} = req.user;

    const projects = await knex("projects").where({organization_id});

    res.send(projects);
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
    createProject: { method: createProject, errorMessage: "Could not create project" },
    getProjects: { method: getProjects, errorMessage: "Could not get projects" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
