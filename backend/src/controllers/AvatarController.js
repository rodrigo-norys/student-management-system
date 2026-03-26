import fs from 'fs';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AvatarController {
  async create(req, res) {
    try {
      const { id, userType } = req.params;

      const validFolders = ['users', 'students', 'guardians', 'staff'];
      const folderName = validFolders.includes(userType) ? userType : 'others';

      if (!id || isNaN(id)) {
        return res.status(400).json({
          errors: ['Missing ID.']
        });
      }

      if (!req.file) {
        return res.status(400).json({
          errors: ['File is required.']
        });
      }

      const { filename } = req.file;

      let model;
      if (userType === 'students') {
        model = Student;
      } else if (userType === 'staff') {
        model = Staff;
      }

      if (!model) {
        return res.status(400).json({
          errors: ['Invalid user type or model not implemented.']
        });
      }

      const entity = await model.findByPk(id);

      if (!entity) {
        return res.status(404).json({
          errors: ['Record not found.']
        });
      }

      const oldAvatar = entity.avatar_url;

      await entity.update({
        avatar_url: filename
      });

      if (oldAvatar) {
        const filePath = resolve(__dirname, '..', '..', 'uploads', 'images', folderName, oldAvatar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.json(entity);
    } catch (e) {
      return res.status(400).json({
        errors: ['Error updating avatar.']
      });
    }
  }
}

export default new AvatarController();
