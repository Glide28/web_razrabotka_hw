import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout({ cartCount }) {
  return (
    <div className="app">
      <Header cartCount={cartCount} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout