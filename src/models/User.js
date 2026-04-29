import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cellphone: String,
  postalCode: String,
  state: String,
  city: String,
  street: String,
  neighborhood: String,
  houseNumber: Number,
  productsCart: [],
  refreshToken: String,
},
{
  timestamps: true, // Adiciona campos createdAt e updatedAt automaticamente
});

// Verifica se o modelo já foi registrado para evitar erros de redefinição
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
