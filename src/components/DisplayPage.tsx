import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography, TextField, InputAdornment, Select, SelectChangeEvent, MenuItem } from '@mui/material';
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

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [expandedAccordions, setExpandedAccordions] = useState<Record<number, boolean>>({});

  const handleColorChange = (event: SelectChangeEvent<string>) => {
    const colorValue = event.target.value;
    setSelectedColor(colorValue);
    localStorage.setItem('selectedColor', colorValue);
  };

  const handleAccordionChange = (index: number) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const colorOptions = [
    { value: '#6AFF08', label: 'ירקרק' },
    { value: '#08FF94', label: 'טורכיז' },
    { value: '#08C4FF', label: 'תכלת' },
    { value: '#0866FF', label: 'כחול בהיר' },
    { value: '#0831FF', label: 'כחול כהה' },
    { value: '#8408FF', label: 'סגול כהה' },
    { value: '#CF08FF', label: 'סגול בהיר' },
    { value: '#FF08A4', label: 'ורוד' },
    { value: '#FF0808', label: 'אדום' },
    { value: '#FFA408', label: 'כתום' },
    { value: '#4A4A4A', label: 'אפור כהה' },
    { value: '#000000', label: 'שחור' },
  ];

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      // Load selectedColor from local storage
      const storedColor = localStorage.getItem('selectedColor');
      if (storedColor) {
        setSelectedColor(storedColor);
      }
    }, 2000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  // console.log(csvData);

  //Handle empty file
  if (!csvData || csvData.length === 0) {
    return <div>No data to display.</div>;
  };

  //Extract column names from the first row of the CSV data
  const headerColumns = Object.keys(csvData[0]);

  // Function to render cards in the accordions
  const renderCards = (rowData: { [columnName: string]: string }) => {
    const columnNames = Object.keys(rowData);

    return columnNames.slice(1).map((columnName, index) => {
      const cellValue = rowData[columnName];
      // console.log(rowData[columnName]);

      // if (cellValue !== undefined && cellValue.trim() !== '') {
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
      // } 
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

        {/* logo */}
        <img src={logo} alt='logo' className='logo' onClick={() => window.location.reload()} />

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

        {/* Color Dropdown */}
        <Select
          value={selectedColor}
          onChange={handleColorChange}
          displayEmpty
          className='color-dropdown'
          inputProps={{ 'aria-label': 'Select color' }}
        >
          {colorOptions.map((color) => (
            <MenuItem key={color.value} value={color.value}>
              {color.label}
            </MenuItem>
          ))}
          <MenuItem value='' disabled>
            בחירת צבע
          </MenuItem>
        </Select>
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
              <div className='texts'>
                <p className='disclaimer'>מציג תוצאות מקובץ:</p>
                <p className='file-name'>{filename}</p>
              </div>
              <div className='delete' onClick={() => window.location.reload()}>
                <DeleteOutlineIcon className='delete-icon' />
                <p className='action-name'>החלפת קובץ</p>
              </div>

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
                // Render accordions for the filtered data
                filteredData.map((rowData, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedAccordions[index] || false}
                    onChange={() => handleAccordionChange(index)}
                  >
                    <AccordionSummary
                      className='accordion-summary'
                      style={{
                        backgroundColor: expandedAccordions[index] ? selectedColor : 'var(--white)',
                      }}
                    >
                      <Typography className='accordion-head-text'>
                        <span className='accordion-head-text-column'></span>{rowData[headerColumns[0]]}
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
                    <Accordion
                      key={index}
                      expanded={expandedAccordions[index] || false}
                      onChange={() => handleAccordionChange(index)}
                    >
                      <AccordionSummary
                        className='accordion-summary'
                        style={{
                          backgroundColor: expandedAccordions[index] ? selectedColor : 'var(--white)',
                        }}
                      >
                        <Typography className='accordion-head-text'>
                          <span className='accordion-head-text-column'></span>{rowData[headerColumns[0]]}
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
      </div >
    </>
  );
};

export default DisplayPage;