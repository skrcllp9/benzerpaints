import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Homepage from './pages/Homepage'
import ContactPage from './pages/ContactPage'
import DealerInquiryPage from './pages/DealerInquiryPage'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dealer-inquiry" element={<DealerInquiryPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
