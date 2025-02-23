/* eslint-disable import/no-extraneous-dependencies */
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User';

class ProfileController {
  async getUsers(req, res) {
    const { allProfiles } = req.params;
    const profiles = await User.find({ allProfiles });

    return res.json(profiles);
  }

  async getUser(req, res) {
    const { user_id } = req.params;
    const profile = await User.findById(user_id);

    return res.json({ data: profile });
  }

  async createUser(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      name: Yup.string().required(),
      cellphone: Yup.string(),
      postalCode: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      street: Yup.string(),
      neighborhood: Yup.string(),
      houseNumber: Yup.number(),
    });

    const {
      email,
      password,
      name,
      cellphone,
      postalCode,
      state,
      city,
      street,
      neighborhood,
      houseNumber,
    } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação dos campos!' });
    }

    const securityForce = 6;
    const hashedPassword = bcrypt.hashSync(password, securityForce);

    const profiles = await User.create({
      email,
      password: hashedPassword,
      name,
      cellphone,
      postalCode,
      state,
      city,
      street,
      neighborhood,
      houseNumber,
    });

    return res.json(profiles);
  }

  async updateUser(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string(),
      name: Yup.string(),
      cellphone: Yup.string(),
      postalCode: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      street: Yup.string(),
      neighborhood: Yup.string(),
      houseNumber: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    const {
      email,
      password,
      name,
      cellphone,
      postalCode,
      state,
      city,
      street,
      neighborhood,
      houseNumber,
    } = req.body;

    const user_id = req.params;

    const securityForce = 6;
    const hashedPassword = bcrypt.hashSync(password, securityForce);

    await User.updateOne({ _id: user_id }, {
      email,
      password: hashedPassword,
      name,
      cellphone,
      postalCode,
      state,
      city,
      street,
      neighborhood,
      houseNumber,
    });

    return res.send();
  }

  async deleteUser(req, res) {
    const { user_id } = req.params;

    await User.findByIdAndDelete({ _id: user_id });

    return res.send();
  }
}

export default new ProfileController();
