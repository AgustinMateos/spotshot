import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Crear cuenta',
  description: 'Regístrate en SpotShot y empieza a vender tus fotos de surf o a encontrar las tuyas.',
  path: '/register',
});


export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthForm mode="register" />
    </AuthLayout>
  );
}