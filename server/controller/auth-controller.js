const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Room for improvement, user has no name, no image, no additional information. 
 * Good to add :)
 */

/**
 * 
 * @param {string} name Name of the organization
 * @returns Unique organization invitation code, appended with random numbers to make it hard to guess.
 */
function generateInviteCode(name){
    // Remove spaces, add ramdom numbers at the end. Replace spaces with '-'
    return name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.floor(Math.random() * 1000);
}

/**
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * This is for owner to signup themselves and create their organization
 */
async function registerOrg(req, res) {
  const { orgName, email, password } = req.body;
  const invite_code = generateInviteCode(orgName);

  const [org] = await knex("organizations").insert({name: orgName,invite_code,}).returning("*");

  if(!org){
    res.status(500).send("There is issue with creating Organization");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [user] = await knex("users").insert({email, password_hash, organization_id: org.id}).returning("*");

  const token = jwt.sign(user, JWT_SECRET);
  res.status(200).send({token, user, invite_link: `${req.protocol}:${req.get("host")}/register?org=${invite_code}`})
}

/**
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * This is for the member to signup themselves
 */
async function registerUser(req, res){
    const {email, password, invite_code} = req.body;

    const org = await knex("organizations").where({invite_code}).first();
    if(!org) return res.status(404).send("Invalid invitation code, organization not found");

    const existingUser = await knex("users").where({email}).first();
    if(existingUser) return res.status(409).send("Email already in use!");

    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await knex("users").insert({email, password_hash, organization_id: org.id}).returning(["id", "email", "organization_id"])

    const token = jwt.sign(user, JWT_SECRET);
    res.status(201).send({token, user});
}

/**
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * Self explanatory :)
 */
async function login(req, res){
    const {email, password} = req.body;
    const user = await knex("users").where({email}).first();
    if(!user) return res.status(401).send("Invalid credentials");
    
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        organization_id: user.organization_id
    }, JWT_SECRET);

    res.send({token, user: { id: user.id, email: user.email, organization_id: user.organization_id}});
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
    registerOrg: { method: registerOrg, errorMessage: "Could not register org" },
    registerUser: { method: registerUser, errorMessage: "Could not register user" },
    login: { method: login, errorMessage: "Could not login" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;