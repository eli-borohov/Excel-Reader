import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography, TextField, InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import logo from '../logo.jpg';
import Lottie from 'lottie-react';
import loaderAnimation from '../loader.json';
import emptyBoxAnimation from '../empty-box.json';


interface DisplayPageProps {
  csvData: { [columnName: string]: string }[] | null;
  filename: string;
}

const DisplayPage: React.FC<DisplayPageProps> = ({ csvData, filename }) => {

  //Declare state for the search-bar
  const [searchTerm, setSearchTerm] = useState<string>('');

  //Deaclare state to the loader animation
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(loadingTimeout);
  }, []);


  //Handle empty file
  if (!csvData || csvData.length === 0) {
    return <div>No data to display.</div>;
  };


  //Extract column names from the first row of the CSV data
  const headerColumns = Object.keys(csvData[0]);

  // Function to render cards in the accordions
  const renderCards = (rowData: { [columnName: string]: string }) => {
    return headerColumns.slice(1).map((columnName, index) => {
      const cellValue = rowData[columnName];
      console.log(cellValue); // Check if cellValue is correct

      if (cellValue !== undefined && cellValue.trim() !== '') {
        return (
          <Card key={index}>
            <CardContent style={{ direction: 'rtl' }}>
              <Typography style={{ whiteSpace: 'pre-line' }}>
                <span className='column-name'>
                  {`${columnName}`}
                </span>
                <br />
                {cellValue}
              </Typography>
            </CardContent>
          </Card>
        );
      }
      return null;
    });
  };

  //Handle search-bar
  const filteredData = csvData.filter((rowData) =>
    headerColumns.some((columnName) => {
      const cellValue = rowData[columnName];
      return cellValue && cellValue.toLowerCase().includes(searchTerm.toLowerCase())
    })
  );


  //The accordions
  return (
    <>
      <div className='head-div'>
        {/* Search Bar */}
        <TextField
          classes={{
            root: 'search-bar',
          }}
          placeholder="חיפוש בכרטיסיות..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {/* <IconButton> */}
                <SearchIcon className='search-icon' />
                {/* </IconButton> */}
              </InputAdornment>
            ),
          }}
        />
        <img src={logo} alt='logo' className='logo' onClick={() => window.location.reload()} />
      </div>




      <div className='display-page'>

        {loading ? (
          // Loader animation
          <div className='loader-div'>
            <Lottie animationData={loaderAnimation} loop={true} className='loader-animation' />
            <p className='loader-p-1'>קורא נתונים מהקובץ שטענת</p>
            <p className='loader-p-2'>יקח לנו ממש כמה רגעים להכין את הכרטיסיות</p>
          </div>
        ) : (
          <>
            {/* File info, and delete */}
            <div className='file-info-div'>
              <p className='file-info-text'>:מציג תוצאות מקובץ</p>
              <p className='file-name'>{filename}</p>
              <DeleteOutlineIcon className='delete-icon' onClick={() => window.location.reload()} />
            </div >

            {/* Display accordions based on filtered or original data */}
            {searchTerm ? (
              //Check if the filtered data is empty and display animation
              filteredData.length === 0 ? (
                <div className='no-results-div'>
                  <Lottie className='empty-box-animation' animationData={emptyBoxAnimation} loop={true} />
                  <p className='no-results-p1'>אופס, ניסית לחפש משהו שלא רשום בכרטיסיות</p>
                  <p className='no-results-p2'>שווה לנסות ולחפש ערך אחר</p>

                </div>
              ) : (
                //Render accordions for the filtered data
                filteredData.map((rowData, index) => (
                  <Accordion key={index}>
                    <AccordionSummary>
                      <ExpandMoreIcon className='expand-more-icon' />
                      <Typography className='accordion-head-text'>
                        <span className='accordion-head-text-column'>{`${headerColumns[0]}`} </span> <br /> {rowData[headerColumns[0]]}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>{renderCards(rowData)}</AccordionDetails>
                  </Accordion>
                ))
              )
            ) : (
              // Display data without search term
              csvData.map((rowData, index) => {
                const nonEmptyProperties = Object.keys(rowData).filter((key) => rowData[key].trim() !== '');
                if (nonEmptyProperties.length > 1) {
                  return (
                    <Accordion key={index}>
                      <AccordionSummary>
                        <ExpandMoreIcon className='expand-more-icon' />
                        <Typography className='accordion-head-text'>
                          <span className='accordion-head-text-column'>{`${headerColumns[0]}`} </span> <br /> {rowData[headerColumns[0]]}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>{renderCards(rowData)}</AccordionDetails>
                    </Accordion>
                  );
                }
                return null;
              })
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DisplayPage;