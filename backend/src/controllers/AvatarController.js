import fs from 'fs';
import { resolve } from 'path';
import Student from '../models/Student.js';

class AvatarController {
  async create(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ errors: ['Missing ID.'] });
      }

      if (!req.file) {
        return res.status(400).json({ errors: ['File is required.'] });
      }

      const { filename } = req.file;

      const student = await Student.findByPk(id);

      if (!student) {
        return res.status(404).json({ errors: ['Student not found or unauthorized.'] });
      }

      const oldAvatar = student.avatar_url;

      await student.update({
        avatar_url: filename
      });

      if (oldAvatar) {
        const filePath = resolve(__dirname, '..', '..', 'uploads', 'images', oldAvatar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.json(student);
    } catch (e) {
      console.log(e);
      return res.status(400).json({errors: ['Error updating avatar.']});
    }
  }
}

export default new AvatarController();
