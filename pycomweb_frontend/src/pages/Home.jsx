import { useState, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap';

import AdvanceFilters from '../components/SearchProteins/AdvanceFilters.jsx';
// import { FaX } from 'react-icons/fa6';
import useFetchQueryProteins from '../customHooks/useFetchQueryProteins.jsx';
import TableComponent from '../components/SearchProteins/TableComponent.jsx'
// import { SEARCH_FILTERS } from '../constants';
// import { GiConsoleController } from 'react-icons/gi';

import { SearchContext } from '../context/SearchContext.jsx';

function Home() {
  /*State to manage responsive sidebar */
  const [navVisible, showNavbar] = useState(false);  /* Not working */
  
  const {filters, pagination} = useContext(SearchContext);
  const {handleFiltersChange, getAppliedFilters} = useContext(SearchContext);
  
  /* Call the hook initially to fetch first 10 protiens without filters */
  const { loading, error } = useFetchQueryProteins(filters, pagination);
  
  /*Render Home Page Components */
  return (

    <Container fluid className="main-content-wrapper">
      <Row>
        {/* --------Advance Filter Component----- */}
        <Col md={3} lg={2} className="sidebar-div">
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
          </Col>
          {/* <!--Filters Applied section--> */}
          {Object.keys(filters).length > 0 && <Col md={12} className="fiters-applied-wrapper">
            <div className="fiters-applied-list-div" >
              {getAppliedFilters()}
            </div>
          </Col>}

          <Col md={12} className="results-table-wrapper">
            <TableComponent
              loading={loading}
              error={error}
            />
          </Col>
        </Col>
      </Row>

    </Container>
  )
}

export default Home
