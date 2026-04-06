/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

class SessionController {
	async login(req, res) {
		try {
			const loginSchema = Yup.object().shape({
				email: Yup.string().email().required(),
				password: Yup.string().required(),
			});

			const { email, password } = req.body;

			if (!(await loginSchema.isValid(req.body))) {
				return res.status(400).json({ fail: '[Falha na validação]: E-mail ou Senha incorretos.' });
			}

			const user = await User.findOne({ email });
			if (!user) {
				return res.status(401).json({ message: 'Credenciais inválidas' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(401).json({ message: 'Credenciais inválidas' });
			}

			const accessToken = jwt.sign({ 
				id: user.id
			}, 
			process.env.JWT_SECRET, 
			{ 
				expiresIn: '30m' 

			});

			const refreshToken = jwt.sign(
			{
				id: user.id
			}, 
			process.env.JWT_REFRESH_SECRET, 
			{
				expiresIn: '7d'

			});

			user.refreshToken = refreshToken;
			await user.save();

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production', 
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60 * 1000 
			});
			
			return res.json({
				token: accessToken,
				user: { id: user.id, name: user.name }
			});

		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
}

export default new SessionController();
