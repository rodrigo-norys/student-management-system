import User from '../models/User.js';

class UserController {
  // create
  async create(req, res) {
    try {
      const newUser = await User.create(req.body);
      const { id, name, email } = newUser
      return res.json({ id, name, email });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message)
      });
    }
  }

  // index
  async index(req, res) {
    try {
      const allUsers = await User.findAll({ attributes: ['id', 'name', 'email']});
      return res.json(allUsers);
    } catch (error) {
      return res.json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      const { id, name, email } = user;
      return res.json({ id, name, email});
    } catch (error) {
      return res.json(null);
    }
  }

  // update
  async update(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['User not found'],
        })
      }

      const newData = await user.update(req.body)
      const { id, name, email } = newData

      return res.json({ id, name, email });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // delete
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userID);

      if (!user) {
        return res.status(400).json({
          errors: ['User not found'],
        })
      }

      await user.destroy()
      return res.json(null);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message)
      });
    }
  }
}

export default new UserController();
