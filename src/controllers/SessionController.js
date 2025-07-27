/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import Jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import authConfig from '../config/auth';

class SessionController {
  async login(req, res) {
    const { email, password } = req.body;
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

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: '[Falha na validação]: E-mail ou Senha incorretos.',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'E-mail não existe.' });
    }

    const userPassword = user.password;

    const bool = bcrypt.compareSync(password, userPassword);

    if (!bool) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const {
      id,
      name,
      email: userEmail,
      cellphone,
      postalCode,
      state,
      city,
      street,
      neighborhood,
      houseNumber,
      productsCart,
    } = user;

    const profile = {
      user: {
        id,
        name,
        email: userEmail,
        cellphone,
        postalCode,
        state,
        city,
        street,
        neighborhood,
        houseNumber,
        productsCart,
      },
      token: Jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
      administrator: adm,
    };

    return res.json({ data: profile });
  }
}

export default new SessionController();
