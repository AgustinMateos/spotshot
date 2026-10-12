import { NOINDEX } from '@/lib/seo';

export const metadata = {
  title: 'Tu compra',
  robots: NOINDEX,
};

export default function PurchaseLayout({ children }) {
  return children;
}
