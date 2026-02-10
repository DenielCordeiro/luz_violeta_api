/* eslint-disable import/no-extraneous-dependencies */
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

class ProfileController {
  async getUsers(req, res) {
    const { allProfiles } = req.params;

    try {
      const profiles = await User.find({ allProfiles });

      return res.status(200).json(profiles);
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao buscar usuários',
        messageError: error
      });
    }
  }

  async getUser(req, res) {
    const { user_id } = req.params;
    try {
      const profile = await User.findById(user_id);
      
      return res.status(200).json({ data: profile });
    } catch (error) {
      
      return res.status(500).json({ 
        fail: 'Erro ao buscar usuário',
        messageError: error
      });
    }
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
      return res.status(400).json({ fail: 'Falha na Validação dos campos!' });
    }

    try {
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
  
      return res.status(200).json(profiles);
    } catch (error) {
      
      return res.status(500).json({ 
        fail: 'Erro ao criar usuário',
        messageError: error
      });
    }
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
      return res.status(400).json({ fail: 'Falha na validação dos campos!' });
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

    try {
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
    } catch (error) {
      
      return res.status(500).json({ 
        fail: 'Erro ao atualizar usuários',
        messageError: error
      });
    }
  }

  async deleteUser(req, res) {
    const { user_id } = req.params;

    try {
      await User.findByIdAndDelete({ _id: user_id });
  
      return res.send();
    } catch (error) {
      
      return res.status(500).json({ 
        fail: 'Erro ao excluir usuário',
        messageError: error
      });
    }
  }
}

export default new ProfileController();
