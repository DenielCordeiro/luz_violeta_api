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

			if (!newProfile) {
				return res.status(500).json({ fail: 'Erro ao criar usuário.' });
			}

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
			email: Yup.string().nullable().notRequired(),
			password: Yup.string().nullable().notRequired(),
			name: Yup.string().nullable().notRequired(),
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
			
			const hashedPassword = "";

			// Se o campo de senha for preenchido, atualiza a senha, caso contrário, mantém a senha atual
			// .trim() para evitar senhas que sejam apenas espaços
			if (password && password.trim() !== "") { 
				const securityForce = 6;
				hashedPassword = bcrypt.hashSync(password, securityForce);
			}

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

			if (!userProfile) {
				return res.status(404).json({ fail: 'Usuário não encontrado.' });
			}

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

			if (!user_id) {
				return res.status(400).json({ fail: 'O ID do usuário é obrigatório para exclusão.' });
			}

			const deletedUser = await User.findByIdAndDelete(user_id);

			// Se deletedUser for null, o ID não existia no banco
			if (!deletedUser) {
				return res.status(404).json({ fail: 'Usuário não encontrado.' });
			}

			// Limpa o cookie de refreshToken para encerrar a sessão do usuário
			res.clearCookie('refreshToken', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});

			return res.status(200).json({ message: 'Conta excluída e sessão encerrada com sucesso.' });
		} catch (error) {
			// Trata erro de ID malformado especificamente se desejar
			if (error.kind === 'ObjectId') {
				return res.status(400).json({
					fail: 'ID de usuário inválido.',
					messageError: error.message
				});
			}

			return res.status(500).json({
				fail: 'Erro ao excluir usuário',
				messageError: error.message
			});
		}
	}
}

export default new ProfileController();