/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import Jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import authConfig from '../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.params;
    let adm = false;

    if (email === 'camila.luzvioleta@gmail.com') {
      adm = true;
    } else {
      adm = false;
    }

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({
        error: '[Falha na validação]: E-mail ou Senha incorretos.',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'E-mail não existe.' });
    }

    const userPassword = await user.password;
    const user_id = await user._id;

    const bool = bcrypt.compareSync(password, userPassword);

    if (!(await bool)) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const {
      id,
      name,
    } = user;

    return res.json({
      user: {
        user_id,
        name,
        email,
      },
      token: Jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
      administrator: adm,
    });
  }
}

export default new SessionController();
