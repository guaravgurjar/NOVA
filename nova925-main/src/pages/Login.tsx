import { useNavigate } from 'react-router-dom';
import { AuthScreen } from '../components/AuthScreen';
import { usePageSEO } from '../lib/usePageSEO';

export function Login() {
  usePageSEO({
    title: 'Login / Register',
    description: 'Sign in or create a NOVA Jewellery account. Access your wishlist, order history, and exclusive offers.',
    noIndex: true,
  });
  const navigate = useNavigate();

  return <AuthScreen onSuccess={() => navigate('/profile')} />;
}
