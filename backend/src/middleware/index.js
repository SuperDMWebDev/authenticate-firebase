const admin = require('../config/firebase-config');
class Middleware {
  async decodeToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.json({ message: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        console.log(decodeValue);
        return next();
      }
      return res.json({ message: 'Unauthorized' });
    } catch (e) {
      console.log('error ' + e.message);
      return res.json({ message: 'Internal Error' });
    }
  }
}
module.exports = new Middleware();
