import AuthLayout from '@/components/AuthLayout';
import Navbar from '@/components/login/Navbar';

export default function RegisterLayout({ children }) {
  return <div><Navbar/>{children}</div>;
}