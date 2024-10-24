import { useEffect } from 'react';
import './App.css';
import { Api } from './Api';
import { timeout } from 'rxjs';

function App() {

  useEffect(() => {
    const api = new Api();

    setTimeout(() => {
      api.getModuleSources();
    },5000);
  },[])

  return (
    <div>
      hoi
    </div>
  );
}

export default App;
