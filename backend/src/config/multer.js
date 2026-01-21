import multer from 'multer';
import { extname, resolve } from 'path';
import Student from "../models/Student";

const random = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: async (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/webp') {
      return cb(new multer.MulterError('File needs to be PNG or JPG'));
    }
    try {
      const { student_id } = req.params;
      if (!student_id) return cb(new multer.MulterError('STUDENT_ID_MISSING'));

      const student = await Student.findByPk(student_id);
      if (!student) return cb(new multer.MulterError('STUDENT_NOT_FOUND'));

      return cb(null, true);
    } catch (e) {
      return cb(new multer.MulterError('DATABASE_ERROR'));
    }
  },

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'uploads', 'images'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${random()}${extname(file.originalname)}`);
    }
  })
};
