import React from 'react';
import { Button } from '@mui/material';
import logo from '../logo.jpg';
import * as XLSX from 'xlsx';

interface WelcomePageProps {
  onCsvDataChange: (data: { [columnName: string]: string }[] | null, filename: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onCsvDataChange }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const workbook = await readExcel(file);
        const sheetName = workbook.SheetNames[1];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to structured data
        const jsonData: XLSX.WorkSheet = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length > 0) {
          const header: string[] = jsonData[0] as string[];
          // console.log(`Sheet: ${sheetName}, Header: ${header}`);

          const rowData = jsonData.slice(1).map((row: (string | number)[]) => {
            const rowDataObj: { [columnName: string]: string } = {};

            row.forEach((value: string | number, index: number) => {
              rowDataObj[header[index]] = value.toString();
            });

            // console.log(`Sheet: ${sheetName}, Row Data:`, rowDataObj);
            return rowDataObj;
          });

          // Pass the data to the parent component
          onCsvDataChange(rowData, file.name);
        } else {
          console.error('Error: Empty sheet data');
        }
      } 
      catch (error) {
        // Handle error
        console.error('Error reading or parsing Excel file', error);
      }
    }
  };

  const readExcel = (file: File): Promise<XLSX.WorkBook> => {
    return new Promise((resolve, rejects) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      };
      reader.onerror = (error) => {
        rejects(error);
      };
      reader.readAsArrayBuffer(file);
    });
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
        <input id='fileInput' type='file' accept='.xlsx' onChange={handleFileChange} style={{ display: 'none' }} />

        {/* Upload file button */}
        <Button className='add-file-button' variant='contained' onClick={handleButtonClick}>
          בחירת קובץ
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
