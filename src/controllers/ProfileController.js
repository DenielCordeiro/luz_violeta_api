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

	async createUser(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string().email().required('O e-mail é obrigatório'),
			password: Yup.string().required('A senha é obrigatória'),
			name: Yup.string().required('O nome é obrigatório'),
			cellphone: Yup.string().nullable().notRequired(),
			postalCode: Yup.string().nullable().notRequired(),
			state: Yup.string().nullable().notRequired(),
			city: Yup.string().nullable().notRequired(),
			street: Yup.string().nullable().notRequired(),
			neighborhood: Yup.string().nullable().notRequired(),
			houseNumber: Yup.number().nullable().notRequired(),
		});

		try {
			if (!(await schema.isValid(req.body))) {
				return res.status(400).json({ fail: 'Falha na Validação!' });
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


			const userExists = await User.findOne({ email });
			if (userExists) {
				return res.status(400).json({ fail: 'Usuário já cadastrado com este e-mail.' });
			}

			const securityForce = 6;
			const hashedPassword = bcrypt.hashSync(password, securityForce);
		
			const newProfile = await User.create({
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

			const userProfile = newProfile.toJSON();
			delete userProfile.password;

			return res.status(201).json(userProfile);

		} catch (error) {
			// Se o erro for do Yup (Validação)
			if (error instanceof Yup.ValidationError) {
				return res.status(400).json({
					fail: 'Falha na Validação!',
					errors: error.errors // Retorna o array de mensagens de erro
				});
			}

			// Se o erro for do Banco de Dados ou outro erro interno
			return res.status(500).json({
				fail: 'Erro interno ao criar usuário',
				messageError: error.message || error
			});
		}
	}

	async updateUser(req, res) {
		const schema = Yup.object().shape({
			user_id: Yup.string().required('O ID do usuário é obrigatório'),
			email: Yup.string().email().required('O e-mail é obrigatório'),
			password: Yup.string().required('A senha é obrigatória'),
			name: Yup.string().required('O nome é obrigatório'),
			cellphone: Yup.string().nullable().notRequired(),
			postalCode: Yup.string().nullable().notRequired(),
			state: Yup.string().nullable().notRequired(),
			city: Yup.string().nullable().notRequired(),
			street: Yup.string().nullable().notRequired(),
			neighborhood: Yup.string().nullable().notRequired(),
			houseNumber: Yup.number().nullable().notRequired(),
		});

		try {
			if (!(await schema.isValid(req.body))) {
				return res.status(400).json({ fail: 'Falha na Validação!' });
			}

			const {
				user_id,
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

			const securityForce = 6;
			const hashedPassword = bcrypt.hashSync(password, securityForce);			

			const userProfile = await User.findOneAndUpdate({ _id: user_id }, {
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

			const userProfileUpdated = userProfile.toObject();
			delete userProfileUpdated.password;

			return res.status(200).json(userProfileUpdated);
		} catch (err) {
			// Se o erro for do Yup (Validação)
			if (err instanceof Yup.ValidationError) {
				return res.status(400).json({
					fail: 'Falha na Validação!',
					errors: err.errors // Retorna o array de mensagens de erro
				});
			}

			// Se o erro for do Banco de Dados ou outro erro interno
			return res.status(500).json({
				fail: 'Erro interno ao atualizar usuário',
				messageError: err.message || err
			});
		}
	}

	async deleteUser(req, res) {
		try {
			const { user_id } = req.params;

			const deletedUser = await User.findByIdAndDelete(user_id);

			if (!deletedUser) {
				return res.status(404).json({ fail: 'Usuário não encontrado' });
			}

			res.clearCookie('refreshToken', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});

			return res.status(200).json({ message: 'Conta excluída e sessão encerrada com sucesso.' });

		} catch (error) {
			return res.status(500).json({
				fail: 'Erro ao excluir usuário',
				messageError: error.message
			});
		}
	}
}

export default new ProfileController();