import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import logo from '../logo.jpg';

interface WelcomePageProps {
  onCsvDataChange: (data: { [columnName: string]: string }[] | null, filename: string) => void;
}



const WelcomePage: React.FC<WelcomePageProps> = ({ onCsvDataChange }) => {
  const [csvData, setCsvData] = useState<{ [columnName: string]: string }[] | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    //Invoke the loader animation

    const file = event.target.files?.[0];
    if (file) {
      try {
        // Read the file content
        const content = await readFile(file);

        // Convert CSV content to structured data
        const parsedCsvData = parseCsv(content);

        // Set the structured data in the state
        setCsvData(parsedCsvData);

        // Pass the data to the parent component
        onCsvDataChange(parsedCsvData, file.name);

      } catch (error) {
        // Handle error
        console.error('Error reading or parsing CSV file', error);
      }
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const parseCsv = (content: string): { [columnName: string]: string }[] => {
    const lines = content.split('\n');
    const header = lines[0].split(',');
    return lines
      .slice(1)
      .map((line) => line.split(',').reduce((acc, value, index) => ({ ...acc, [header[index]]: value }), {}));
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className='welcome-div-wrapper'>
    <div className='welcome-div'>
      <img src={logo} alt="Logo" className='welcome-logo' />
          {/* Welcome message */}
          <p className='p-1'>ברוכים הבאים</p>
          <p className='p-2'>על מנת להתחיל, יש לטעון את הקובץ הרצוי מהמכשיר</p>
          <p className='p-3'>(בלבד CSV ניתן לטעון קבצים בפורמט)</p>

          {/* Hidden file input */}
          <input id='fileInput' type='file' accept='.csv' onChange={handleFileChange} style={{ display: 'none' }} />

          {/* Upload file button */}
          <Button className='add-file-button' variant='contained' onClick={handleButtonClick}>
            בחירת קובץ
          </Button>
    </div>
    </div>
  );
};

export default WelcomePage;
