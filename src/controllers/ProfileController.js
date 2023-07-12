import * as Yup from 'yup';
import User from '../models/User';

class ProfileController {
  async index(req, res) {
    const { allProfiles } = req.params;
    const profiles = await User.find({ allProfiles });

    return res.json(profiles);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      name: Yup.string().required(),
      address: Yup.string().required(),
    });

    const {
      email,
      password,
      name,
      address,
    } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na Validação dos campos!' });
    }

    const profiles = await User.create({
      email,
      password,
      name,
      address,
    });

    return res.json(profiles);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      name: Yup.string().required(),
      address: Yup.string().required(),
    });

    const { user_id } = req.params;

    const {
      email,
      password,
      name,
      address,
    } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    await User.updateOne({ _id: user_id }, {
      email,
      password,
      name,
      address,
    });

    return res.send();
  }

  async destroy(req, res) {
    const { user_id } = req.body;

    await User.findByIdAndDelete({ _id: user_id });

    return res.send();
  }
}

export default new ProfileController();
