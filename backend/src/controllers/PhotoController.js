import Photo from '../models/Photo';

class PhotoController {
  async create(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          errors: ['Invalid file or student could not be found'],
        });
      }

      const { originalname, filename } = req.file;
      const { student_id } = req.params;

      const photo = await Photo.create({ originalname, filename, student_id });

      return res.json(photo);
    } catch (e) {
      return res.status(400).json({
        errors: ['Photo could not be save. Verify your data.'],
      });
    }
  }
}

export default new PhotoController();
