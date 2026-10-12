import FaqPage from '@/components/FaqPage'
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Preguntas frecuentes',
  description: 'Resolvemos tus dudas sobre cómo encontrar, comprar y descargar tus fotos de surf en SpotShot.',
  path: '/faqs',
});



const page = () => {
  return (
    <div className='pt-20'>
       
        <FaqPage/></div>
  )
}

export default page