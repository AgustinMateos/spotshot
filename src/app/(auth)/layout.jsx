import AuthLayout from '@/components/AuthLayout';
import Navbar from '@/components/login/Navbar';
import Footer from '@/components/Footer';
export default function RegisterLayout({ children }) {
  return <div>
    <Navbar/>
    {children}
    <Footer />
    </div>;
}