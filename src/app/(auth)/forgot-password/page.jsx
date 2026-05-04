import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthForm mode="forgot" />
    </AuthLayout>
  );
}