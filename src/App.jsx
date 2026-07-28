import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileTabBar from './components/MobileTabBar'
import Home from './pages/Home'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import BestValue from './pages/BestValue'
import NewArrivals from './pages/NewArrivals'
import TrackOrder from './pages/TrackOrder'
import DeliveryReturns from './pages/DeliveryReturns'
import PrescriptionOrders from './pages/PrescriptionOrders'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Account from './pages/Account'
import Admin from './pages/Admin'
import RequireAuth from './components/RequireAuth'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()

  /* The admin runs in its own full-screen shell with a sidebar, so it does
     not use the storefront header, footer or mobile tab bar. */
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin"
            element={
              <RequireAuth admin>
                <Admin />
              </RequireAuth>
            }
          />
        </Routes>
      </>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/best-value" element={<BestValue />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/delivery-returns" element={<DeliveryReturns />} />
          <Route path="/prescription-orders" element={<PrescriptionOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  )
}
