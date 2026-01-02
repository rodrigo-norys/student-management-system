import Photo from '../models/Photo';

class PhotoController {
  async create(req, res) {
     try {
        const { originalname, filename } = req.file;
        const { student_id } = req.body;
        const photo = await Photo.create({ originalname, filename, student_id });
        return res.json(photo);
      } catch (e) {
        return res.status(400).json({
          errors: ['Student cannot be found']
        });
      }
    };
  }

export default new PhotoController();
