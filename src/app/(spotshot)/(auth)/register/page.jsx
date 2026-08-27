import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthForm mode="register" />
    </AuthLayout>
  );
}