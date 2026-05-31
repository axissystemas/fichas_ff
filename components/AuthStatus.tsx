// AuthStatus.tsx – componente de autenticação Google via Supabase
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, LogIn } from 'lucide-react';

export const AuthStatus = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Atualiza estado ao mudar sessão
  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error('Login error:', error.message);
    setLoading(false);
  };
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
    setLoading(false);
  };

  if (loading) {
    return (
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer" disabled>
        <Loader2 className="animate-spin" size={12} />
        Carregando...
      </button>
    );
  }

  return user ? (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs uppercase font-bold tracking-wider cursor-pointer"
    >
      Sair ({user.email?.split('@')[0]})
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="flex items-center gap-1.5 px-2.5 py-1.5 border border-current hover:bg-[#3D2B1F]/10 transition text-xs uppercase font-bold tracking-wider cursor-pointer"
    >
      <LogIn size={12} /> Entrar com Google
    </button>
  );
};

export default AuthStatus;
