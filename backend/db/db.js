const mongoose = require('mongoose');
class Connection {
  async connectDB() {
    try {
      const connectionConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      await mongoose.connect('mongodb://localhost/todo-app', connectionConfig);
      console.log('Connected to Mongodb');
    } catch (err) {
      console.log('Cannot connect to Mongodb ', err);
    }
  }
}
module.exports = new Connection();
