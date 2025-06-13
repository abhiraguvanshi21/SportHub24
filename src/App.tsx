import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import LiveScoring from './pages/LiveScoring';
import Contact from './pages/Contact';
import UserScoring from './pages/UserScoring';
import AddMatch from './pages/AddMatch';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/live-scoring" element={<LiveScoring />} />
            <Route path="/user-scoring" element={<UserScoring />} />
            <Route path="/add-match" element={<AddMatch />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;