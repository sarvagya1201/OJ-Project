import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <AppRoutes />
    </div>
  );
}

export default App;
