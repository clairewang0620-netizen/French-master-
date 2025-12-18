import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Expressions from './pages/Expressions';
import Grammar from './pages/Grammar';
import Reading from './pages/Reading';
import Dictation from './pages/Dictation';
import Exam from './pages/Exam';
import Profile from './pages/Profile';

// Use HashRouter for fool-proof static deployment on Cloudflare Pages without server config
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vocab" element={<Vocabulary />} />
          <Route path="expressions" element={<Expressions />} />
          <Route path="grammar" element={<Grammar />} />
          <Route path="reading" element={<Reading />} />
          <Route path="dictation" element={<Dictation />} />
          <Route path="exam" element={<Exam />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
