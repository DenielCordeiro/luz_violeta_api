import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: '[Falha na validação]: E-mail ou Senha incorretos',
      });
    }

    const user = await User.findOne({ email, password });

    return res.json(user);
  }
}

export default new SessionController();
