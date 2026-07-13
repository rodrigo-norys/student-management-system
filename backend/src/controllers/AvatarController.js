import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Guardian from '../models/Guardian.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isValidId(id) {
  return id && !isNaN(Number(id)) && Number(id) > 0;
}

class AvatarController {
  async create(req, res) {
    try {
      const { id, userType } = req.params;

      if (!isValidId(id))
        return res.status(400).json({
          errors: ['Missing or invalid ID.'],
        });
      if (!req.file)
        return res.status(400).json({
          errors: ['File is required.'],
        });

      const models = {
        students: Student,
        staff: Staff,
        users: User,
        guardians: Guardian,
      };

      const Model = models[userType];
      if (!Model) {
        return res.status(400).json({
          errors: ['Invalid user type.'],
        });
      }

      const entity = await Model.findByPk(id);
      if (!entity) {
        return res.status(404).json({
          errors: ['Record not found.'],
        });
      }

      const oldAvatar = entity.avatar_url;
      const { filename } = req.file;

      await entity.update({ avatar_url: filename });

      if (oldAvatar) {
        const folderName = ['students', 'staff', 'guardians', 'users'].includes(
          userType,
        )
          ? userType
          : 'others';
        const filePath = path.resolve(
          __dirname,
          '..',
          '..',
          'uploads',
          'images',
          folderName,
          oldAvatar,
        );

        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
        } catch (err) {
          console.warn(
            `Could not delete old avatar: ${oldAvatar}. Error: ${err.message}`,
          );
        }
      }

      return res.json({
        id: entity.id,
        avatar_url: filename,
        message: 'Avatar updated successfully.',
      });
    } catch (e) {
      console.error('AvatarController Error:', e);
      return res.status(500).json({
        errors: ['An internal error occurred while updating the avatar.'],
      });
    }
  }
}

export default new AvatarController();
