import React, { useState } from 'react';
import { authService } from './services/auth';
import './index.css';

// Referencia Brutalist UI: Un estilo de caja cruda con sombras gruesas y bordes oscuros
export default function AuthApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  const [user, setUser] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      if (mode === 'login') {
        const data = await authService.login(email, password);
        setUser(data);
        setMensaje(`Bienvenido ${data.nombre}`);
      } else {
        const data = await authService.register(nombre, email, password);
        setUser(data);
        setMensaje(`Registro exitoso para ${data.nombre}`);
      }
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const logout = async () => {
    try {
      if (user?.token) await authService.logout(user.token);
    } finally {
      setUser(null);
      setMensaje('Desconectado');
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-[#FFF4E0] flex items-center justify-center p-6">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
          {/* Brutalist Avatar (Ejemplo) */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-black overflow-hidden bg-yellow-400 flex items-center justify-center text-4xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {user.nombre[0].toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase text-center mb-6">Perfil</h1>
          <p className="text-xl font-bold border-b-2 border-black pb-2 mb-4">Email: {user.email}</p>
          <button 
            onClick={logout}
            className="w-full bg-red-400 hover:bg-red-500 text-black font-black text-xl py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0E7FF] flex items-center justify-center p-6 font-sans">
      <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2">
          {mode === 'login' ? 'INICIAR SESIÓN' : 'REGISTRO'}
        </h1>
        
        {mensaje && (
          <div className="bg-red-200 border-2 border-black p-3 mb-6 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label className="block text-xl font-black mb-2 uppercase">Nombre</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
                required 
              />
            </div>
          )}
          
          <div>
            <label className="block text-xl font-black mb-2 uppercase">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
              required 
            />
          </div>

          <div>
            <label className="block text-xl font-black mb-2 uppercase">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
              required 
              minLength={8}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#A3E635] text-black font-black text-2xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all uppercase"
          >
            {mode === 'login' ? 'Entrar' : 'Unirse'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white inline-block transition-colors"
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate.' : '¿Ya tienes cuenta? Inicia Sesión.'}
          </button>
        </div>
      </div>
    </div>
  );
}
