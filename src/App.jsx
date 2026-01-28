import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import Subscribe from './pages/Subscribe';
import ArticleDetail from './pages/ArticleDetail';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Submit from './pages/Submit';
import Print from './pages/Print';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/print" element={<Print />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
