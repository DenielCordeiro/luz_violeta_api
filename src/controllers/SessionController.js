/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import Jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import authConfig from '../config/auth';

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
        error: '[Falha na validação]: E-mail ou Senha incorretos.',
      });
    }

    const user = await User.findOne({ email });
    const userPassword = await user.password;

    if (!user) {
      return res.status(401).json({ error: 'E-mail não existe.' });
    }

    const bool = bcrypt.compareSync(password, userPassword);

    if (!(await bool)) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const {
      id,
      name,
      address,
    } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        address,
      },
      token: Jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
