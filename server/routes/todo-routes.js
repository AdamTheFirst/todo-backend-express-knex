const express = require("express");
const router = express.Router();
const controller = require("../controller/todo-controller");
const auth = require("../middleware/auth")

router.get('/projects/:projectId/todos', auth, controller.getTodos);
router.post('/', auth, controller.createTodo);
router.patch('/:id', auth, controller.updateTodo);
router.delete('/:id', auth, controller.deleteTodo);

module.exports = router;