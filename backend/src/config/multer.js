// @ts-check
import multer from 'multer';
import { extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const random = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/webp'
    ) {
      return cb(new multer.MulterError('FILE_TYPE_NOT_SUPPORTED'));
    }
    return cb(null, true);
  },

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { userType } = req.params;

      const validFolders = ['users', 'students', 'guardians', 'staff'];
      const folderName = validFolders.includes(userType) ? userType : 'others';

      const targetPath = resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        'images',
        folderName,
      );

      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      cb(null, targetPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${random()}${extname(file.originalname)}`);
    },
  }),
};
