import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';
import { pageMeta, NOINDEX } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Recuperar contraseña',
  description: 'Recupera el acceso a tu cuenta de SpotShot.',
  path: '/forgot-password',
  robots: NOINDEX,
});


export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthForm mode="forgot" />
    </AuthLayout>
  );
}