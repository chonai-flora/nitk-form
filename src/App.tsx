import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Form from './components/Form';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <div>
      <div className='app'>
        <header className='header'>
          <h1>
            熊本高専わいわい工作わくわく実験ひろば<br />
            申し込みフォーム
          </h1>
        </header >

        <div className='page'>
          <Router>
            <Routes>
              <Route path='/' element={<Form />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Router>
        </div>

        <div className='pb-3' />
      </div>

      <p className='m-4 text-center'>&copy; 2023 NITK-Form</p>
    </div >
  );
}

export default App;