import { NOINDEX } from '@/lib/seo';

export const metadata = {
  title: 'Cuenta',
  robots: NOINDEX,
};

export default function AccountAuthLayout({ children }) {
  return children;
}
