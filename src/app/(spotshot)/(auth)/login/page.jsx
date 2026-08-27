import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm isLogin={true} />
    </AuthLayout>
  );
}