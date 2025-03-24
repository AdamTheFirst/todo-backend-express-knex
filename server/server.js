const app = require('./server-config.js');
const projectRoutes = require('./routes/project-routes.js');
const authRoutes = require('./routes/auth-routes.js')
const todoRoutes = require('./routes/todo-routes.js')

app.use(projectRoutes);
app.use(authRoutes);
app.use(todoRoutes);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;