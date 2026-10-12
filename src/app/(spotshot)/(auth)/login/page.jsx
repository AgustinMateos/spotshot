import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';
import { pageMeta, NOINDEX } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Iniciar sesión',
  description: 'Accede a tu cuenta de SpotShot.',
  path: '/login',
  robots: NOINDEX,
});


export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm isLogin={true} />
    </AuthLayout>
  );
}