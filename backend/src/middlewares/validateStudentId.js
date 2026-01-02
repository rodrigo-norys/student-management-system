import Student from "../models/Student";

export default async (req, res, next) => {
  try {
    const { student_id } = req.body;

    const teste = await Student.findByPk(student_id)
    if (!teste) {
      return res.status(400).json({
        errors: ['Student not found (Middleware validation)']
      });
    }
    return next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errors: ['Erroorrrrrrr'] });
  }
}
