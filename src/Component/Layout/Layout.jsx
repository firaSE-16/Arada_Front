import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import BottomNav from '@/components/layoutComponents/BottomNav';

const Layout = ({children}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout