import React, { useState } from 'react'
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import AdvanceFilters from '../components/SearchProteins/AdvanceFilters.jsx';
import { FaX } from 'react-icons/fa6';
import useFetchQueryProteins from '../customHooks/useFetchQueryProteins.jsx';
import TableComponent from '../components/SearchProteins/TableComponent.jsx'
import { SEARCH_FILTERS } from '../constants';
import { GiConsoleController } from 'react-icons/gi';

function Home() {
  /*State to manage responsive sidebar */
  const [navVisible, showNavbar] = useState(false);  /* Not working */
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    recordsPerPage: 10,
  });
  const [uniprot_id, setUniprot_id] = useState('');


  const { data, loading, error } = useFetchQueryProteins(filters, pagination);

  // Called by apply filter button in advance filter component
  const handleFiltersChange = (newFilters) => {

    if (uniprot_id) {
      newFilters = { ...newFilters, uniprot_id }
    } else {
      delete newFilters.uniprot_id;
    }
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset page to 1 on filter change
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRecordsPerPageChange = (recordsPerPage) => {
    setPagination((prev) => ({ ...prev, recordsPerPage, page: 1 }));
  };

  // called by search button next to UniProt ID input field
  const handleSearchBtn = () => {
    // const newFilters = { ...filters, uniprot_id }
    handleFiltersChange(filters);
  }

  // called when user presses enter button ater typing UniprotID
  const handleSearchBoxKeyDown = (event) => {
    if (event.key == "Enter") {
      handleFiltersChange(filters);
    }
  }

  const handleRemoveFilter = (filterName) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterName];
      console.log("not me ")
      console.log(newFilters)
      return newFilters;
    });
    console.log(filters)
  };

  // To display applied filters as tags
  const getAppliedFilters = () => {
    const appliedFilters = Object.entries(filters)
    console.log("hii")
    console.log(appliedFilters)
    console.log(filters)
    return (
      <div>
        {appliedFilters.map(([name, value]) => {
          const label = SEARCH_FILTERS[name];
          return label && value.length > 0 ? (
            <span key={name} style={{ margin: '5px', padding: '5px', border: '1px solid black', borderRadius: '3px' }}>
              {label}: {value} <FaX onClick={() => handleRemoveFilter(name)} />
            </span>
          ) : null;
        })}
      </div>
    );
  }


  /*Render Home Page Components */
  return (

    <Container fluid className="main-content-wrapper">
      <Row>
        <Col md={3} lg={2} className="sidebar-div advance-filter-div ">
          <AdvanceFilters visible={navVisible} show={showNavbar} filters={filters} onFilterChange={handleFiltersChange} />
        </Col>
        {/* <!--Right Content Section-> */}
        <Col md={9} lg={10} className="right-content-div search-results-div d-flex flex-column flex-column-fluid">
          {/* <!--Header Section--> */}
          <Col md={12} className="content-header-wrapper">
            <div className='header-title col-md-6'>
              <div className='h5'>Search Proteins</div>
              <span>Search Using UniProt ID or use Advance Filters</span>
            </div>
            <div className="header-search-box col-md-6">
              <input
                type="text"
                placeholder='Search By UniProtID'
                name="uniprot_id"
                defaultValue={filters.uniprot_id || ''}
                onChange={(e) => setUniprot_id(e.target.value)}
                onKeyDown={handleSearchBoxKeyDown}
              />
              <button type="button" onClick={handleSearchBtn}><FaSearch /></button>
            </div>
          </Col>
          {/* <!--Filters Applied section--> */}
          {Object.keys(filters).length > 0 && <Col md={12} className="fiters-applied-wrapper">
            <div className="fiters-applied-list-div" >
              {getAppliedFilters()}
            </div>
          </Col>}

          <Col md={12} className="results-table-wrapper">
            <TableComponent
              data={data}
              loading={loading}
              error={error}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRecordsPerPageChange={handleRecordsPerPageChange}
            />
          </Col>
        </Col>
      </Row>

    </Container>
  )
}

export default Home
