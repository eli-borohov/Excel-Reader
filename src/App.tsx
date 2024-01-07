import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import DisplayPage from './components/DisplayPage';
import './App.css';

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<{ [columnName: string]: string }[] | null>(null);
  const [filename, setFilename] = useState<string>('');

  return (
    <div className='app'>
      {csvData ? (
        <DisplayPage csvData={csvData} filename={filename}/>
      ) : (
        <WelcomePage
        onCsvDataChange={(data, name) => {
          setCsvData(data);
          setFilename(name);
        }}
          />
      )}
    </div>
  );
};

export default App;