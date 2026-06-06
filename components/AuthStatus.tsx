// AuthStatus.tsx – componente de autenticação Google via Supabase
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSheetStore } from '@/store/useSheetStore';
import { Loader2, LogOut } from 'lucide-react';

export const AuthStatus = () => {
  const { user, setUser, loadSheetsList, clearLocalState } = useSheetStore();
  const [loading, setLoading] = useState(false);

  // Atualiza estado ao mudar sessão e sincroniza com Zustand
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      if (activeUser) {
        setUser({
          id: activeUser.id,
          email: activeUser.email,
          user_metadata: activeUser.user_metadata,
        });
        loadSheetsList();
      } else {
        clearLocalState();
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      if (activeUser) {
        setUser({
          id: activeUser.id,
          email: activeUser.email,
          user_metadata: activeUser.user_metadata,
        });
        loadSheetsList();
      } else {
        clearLocalState();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
    clearLocalState();
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

  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-2.5 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs uppercase font-bold tracking-wider cursor-pointer"
    >
      <LogOut size={12} /> Sair ({user.email?.split('@')[0]})
    </button>
  );
};

export default AuthStatus;
