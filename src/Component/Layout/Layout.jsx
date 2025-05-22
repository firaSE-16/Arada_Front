import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import BottomNav from '@/components/layoutComponents/BottomNav';

const Layout = ({children}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-screen-xl mx-auto px-4 py-6 w-full">
        {children}
      </main>
      <Footer />
    
    </div>
  );
}

export default Layout;