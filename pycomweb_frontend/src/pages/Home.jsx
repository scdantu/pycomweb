import { useState, useContext, useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap';

import AdvanceFilters from '../components/SearchProteins/AdvanceFilters.jsx';
// import { FaX } from 'react-icons/fa6';
import useFetchQueryProteins from '../customHooks/useFetchQueryProteins.jsx';
import TableComponent from '../components/SearchProteins/TableComponent.jsx'
// import { SEARCH_FILTERS } from '../constants';
// import { GiConsoleController } from 'react-icons/gi';
import styles from "../styles/Home.module.css";
import MultiRangeSlider from "multi-range-slider-react";


import { SearchContext } from '../context/SearchContext.jsx';

function Home() {
  /*State to manage responsive sidebar */
  const [navVisible, showNavbar] = useState(false);  /* Not working */

  const { filters, pagination } = useContext(SearchContext);
  const { handleFiltersChange, getAppliedFilters, clearIndividualFilter} = useContext(SearchContext);
  const { advancedFilters, appliedFilterList } = useContext(SearchContext);
  const { SEQUENCE_LENGTH, HELICAL_STRUCTURE, TURN_STRUCTURE, BETA_STRAND } = advancedFilters;
  const { PDB, PTM, SUBTRATE, DISEASES } = advancedFilters;
  const { CATH, EC } = advancedFilters;
  const { updateFilters, resetFilters } = useContext(SearchContext);

  
  /* Call the hook initially to fetch first 10 protiens without filters */
  const { loading, error } = useFetchQueryProteins(filters, pagination);

  // const [minValue, set_minValue] = useState(0);
  // const [maxValue, set_maxValue] = useState(100);
  // const handleInput = (e) => {
  //   set_minValue(e.minValue);
  //   set_maxValue(e.maxValue);
  // };

  // const [minRValue, set_minRValue] = useState(1);
  // const [maxRValue, set_maxRValue] = useState(500);
  const handleInputR = (element, e) => {
    

    if(e.minValue != element.min || e.maxValue != element.max)
    {
      let payload = {
        min: e.minValue,
        max: e.maxValue
      }
      updateFilters(element.id, element.type, payload);
    }
  };

  const handleBoolean = (element) => {
    updateFilters(element.id, element.type);
  }

  const setInputVal2 = (element, e) => {
    if(e != element.inputVal) {
      let payload = {
        inputVal: e
      }
      updateFilters(element.id, element.type, payload)
    }
  }

  // const sliderProps = {
  //   style:{border: 'none', boxShadow: 'none', padding: 0, marginTop: '1rem', width: '150px'},
  //     min:0,
  //     max:100,
  //     step:1,
  //     minValue:minValue,
  //     maxValue:maxValue,
  //     label:false,
  //     ruler:false,
  //     barInnerColor:'#8a41ff',
  //     barLeftColor:'#cccccc',
  //     barRightColor:'#cccccc',
  //     thumbLeftColor:'#000000',
  //     thumbRightColor:'#000000',
  // }

  const list = [
    'Acetoin biosynthesis',
    'Acetoin catabolism',
    'Acute phase',
    'Alginate biosynthesis',
    'Alkaloid metabolism',
    'Alkylphosphonate uptake',
    'Amino-acid biosynthesis',
    'Amino-acid transport',
    'Angiogenesis',
    'Anion exchange'
  ];
  const [filteredList, setFilteredList] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const resultLimit = 5;

  const inputRef = useRef();

  const filterFunction = () => {
    // console.log('data')
    //we only want the first x matches
    let result = [];
    for (const item of list) {
      if (item.toLowerCase().includes(inputVal.toLowerCase())) {
        result.push(item);
        if (result.length === resultLimit) break; // Stop once we have 10 matches
      }

      setFilteredList(result);
    }

    // setFilteredList(list.filter(item => item.includes(inputVal))).slice(0,10);
    // console.log(filteredList);

    // const input = document.getElementById("myInput");
    // const filter = input.value.toUpperCase();
    // const div = document.getElementById("myDropdown");
    // const a = div.getElementsByTagName("a");
    // for (let i = 0; i < a.length; i++) {
    //   txtValue = a[i].textContent || a[i].innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     a[i].style.display = "";
    //   } else {
    //     a[i].style.display = "none";
    //   }
    // }
  }

  const setInputValue = (val) => {
    setInputVal(val);
    setFilteredList([]);

    // inputRef.currentValue = val;
  }

  //debounce input
  useEffect(() => {
    if (inputRef.current.value) {
      const getData = setTimeout(() => {
        filterFunction();
      }, 200)

      return () => clearTimeout(getData)
    } else {
      if (inputRef.current.value === "") {
        //show first 10 results
        setFilteredList(list.slice(0, resultLimit));
      }
    }
  }, [inputVal])



  /*Render Home Page Components */
  return (
    <div className={styles.Home}>
      <div>
        {/* <h1>Find Proteins</h1> */}
        {/* <p>Find proteins via their UniProtId or our advance filters</p> */}

      </div>
      {/* <br /> */}
      <div className={styles.HomeSearchBlock}>
        <div className={styles.HomeSearchTypes}>
          {/* <button className={styles.HomeStandardSearchButton}>Search</button> */}

          <div className={styles.HomeAdvancedSearchButton}>
            <div className={styles.HomeAdvancedSearchLabel}>Advanced Filters ({appliedFilterList.length})</div>
            <div className={styles.HomeAdvancedFiltersContainer}>

              <div className={styles.SearchAdvancedFilters}>
                {/* Single Drop Lists */}
                <div className={styles.advFilterSingleDropList}>
                  {/* Biological Process */}
                  <div className={styles.DropDownContent}>
                    <label>Biological Process</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DropDownContent}>
                    <label>Cellular Component</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DropDownContent}>
                    <label>Developmental Stage</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DropDownContent}>
                    <label>Domain</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DropDownContent}>
                    <label>Ligand</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DropDownContent}>
                    <label>Molecular Function</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.DropDownContent}>
                    <label title="Post-Translational Modification">PTM</label>
                    <div>
                      <input type="text" className={styles.InputList} placeholder="None" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                      <div className={styles.List}>
                        {filteredList.map(item => (
                          <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                        ))}
                      </div>
                    </div>
                  </div>



                </div>
                <div className={styles.advFilterIDFeatureAndClassesList}>
                  {/* ID/Feature */}
                  <div className={styles.advFilterIDFeatureList}>
                    <div className={styles.DropDownContent}>
                      <label>Organism</label>
                      <div>
                        <input type="text" className={styles.InputList} placeholder="ID / Organism" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                        <div className={styles.List}>
                          {filteredList.map(item => (
                            <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={styles.DropDownContent}>
                      <label>Disease</label>
                      <div>
                        <input type="text" className={styles.InputList} placeholder="ID / Disease" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                        <div className={styles.List}>
                          {filteredList.map(item => (
                            <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={styles.DropDownContent}>
                      <label>CoFactor</label>
                      <div>
                        <input type="text" className={styles.InputList} placeholder="ID / CoFactor" ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} />
                        <div className={styles.List}>
                          {filteredList.map(item => (
                            <li key={item} onClick={() => setInputValue(item)}><p>{item}</p></li>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Class List */}
                  <div className={styles.advFilterClassesList}>
                    <div className={styles.DropDownContent}>
                      <label>{CATH.displayname}</label>
                      <div>
                        {/* <input type="text" className={styles.InputList} placeholder={CATH.placeholder} ref={inputRef} onChange={(event) => setInputVal(event.target.value)} value={inputVal} /> */}
                        <input type="text" className={styles.InputList} placeholder={CATH.placeholder} onChange={(event) => setInputVal2(CATH, event.target.value)} value={CATH.inputVal} />
                        <div className={styles.Example}>
                          <div>
                            <b>Examples</b>
                            <table>
                              <tr><td>3.*</td><td>Include all in Major class</td></tr>
                              <tr><td>3.4.*</td><td>Inclue all in Major.Sub Class</td></tr>
                              <tr><td>3.4.52.*</td><td>Inclue all in Major.Sub.Sub Class</td></tr>
                              <tr><td>3.4.52.48&nbsp;&nbsp;</td><td>Include Specifc CATH</td></tr>
                            </table>
                          </div>
                        </div>
                      </div><span onClick={() => clearIndividualFilter(CATH)}>x</span>
                    </div>

                    <div className={styles.DropDownContent}>
                      <label title="Enzyme Commission">{EC.displayname}</label>
                      <div>
                        <input type="text" className={styles.InputList} placeholder={EC.placeholder} onChange={(event) => setInputVal2(EC, event.target.value)} value={EC.inputVal} />
                        <div className={styles.Example}>
                          <div>
                            <b>Examples</b>
                            <table>
                              <tr><td>3.*</td><td>Include all in Major class</td></tr>
                              <tr><td>3.4.*</td><td>Inclue all in Major.Sub Class</td></tr>
                              <tr><td>3.4.52.*</td><td>Inclue all in Major.Sub.Sub Class</td></tr>
                              <tr><td>3.4.52.48&nbsp;&nbsp;</td><td>Include Specifc Enzyme Commission</td></tr>
                            </table>

                          </div>
                        </div>
                      </div><span onClick={() => clearIndividualFilter(EC)}>x</span>
                    </div>
                  </div>
                </div>
                {/* Range List */}
                <div className={styles.advFilterRangeList}>
                  <div className={styles.HomeAdvancedFiltersRangeFilter2}>
                    <div>
                      <label>{HELICAL_STRUCTURE.displayname}</label>
                      <div className={styles.HomeSliderAnnotations}>
                        <span>{HELICAL_STRUCTURE.min}%</span>
                        <span>to</span>
                        <span>{HELICAL_STRUCTURE.max}%</span>
                      </div>
                    </div>
                    <div className={styles.HomeAdvancedFiltersRangeFilter2RangeWrap}>
                      <MultiRangeSlider
                        style={{ border: 'none', boxShadow: 'none', margin: '.4rem', padding: '.5rem', width: '120px' }}
                        min={HELICAL_STRUCTURE.range.min}
                        max={HELICAL_STRUCTURE.range.max}
                        step={1}
                        minValue={HELICAL_STRUCTURE.min}
                        maxValue={HELICAL_STRUCTURE.max}
                        label={false}
                        ruler={false}
                        barInnerColor='#8a41ff'
                        barLeftColor='#cccccc'
                        barRightColor='#cccccc'
                        thumbLeftColor='#000000'
                        thumbRightColor='#000000'
                        onInput={(e) => {
                          handleInputR(HELICAL_STRUCTURE, e);
                        }}
                      /><span onClick={() => clearIndividualFilter(HELICAL_STRUCTURE)}>x</span>
                    </div>
                  </div>

                  <div className={styles.HomeAdvancedFiltersRangeFilter2}>
                    <div>
                      <label>{TURN_STRUCTURE.displayname}</label>
                      <div className={styles.HomeSliderAnnotations}>
                        <span>{TURN_STRUCTURE.min}%</span>
                        <span>to</span>
                        <span>{TURN_STRUCTURE.max}%</span>
                      </div>
                    </div>
                    <div className={styles.HomeAdvancedFiltersRangeFilter2RangeWrap}>
                      <MultiRangeSlider
                        style={{ border: 'none', boxShadow: 'none', margin: '.4rem', padding: '.5rem', width: '120px' }}
                        min={TURN_STRUCTURE.range.min}
                        max={TURN_STRUCTURE.range.max}
                        step={1}
                        minValue={TURN_STRUCTURE.min}
                        maxValue={TURN_STRUCTURE.max}
                        label={false}
                        ruler={false}
                        barInnerColor='#8a41ff'
                        barLeftColor='#cccccc'
                        barRightColor='#cccccc'
                        thumbLeftColor='#000000'
                        thumbRightColor='#000000'
                        onInput={(e) => {
                          handleInputR(TURN_STRUCTURE, e);
                        }}
                      /><span onClick={() => clearIndividualFilter(TURN_STRUCTURE)}>x</span>
                    </div>
                  </div>

                  <div className={styles.HomeAdvancedFiltersRangeFilter2}>
                    <div>
                      <label>{BETA_STRAND.displayname}</label>
                      <div className={styles.HomeSliderAnnotations}>
                        <span>{BETA_STRAND.min}%</span>
                        <span>to</span>
                        <span>{BETA_STRAND.max}%</span>
                      </div>
                    </div>
                    <div className={styles.HomeAdvancedFiltersRangeFilter2RangeWrap}>
                      <MultiRangeSlider
                        style={{ border: 'none', boxShadow: 'none', margin: '.4rem', padding: '.5rem', width: '120px' }}
                        min={BETA_STRAND.range.min}
                        max={BETA_STRAND.range.max}
                        step={1}
                        minValue={BETA_STRAND.min}
                        maxValue={BETA_STRAND.max}
                        label={false}
                        ruler={false}
                        barInnerColor='#8a41ff'
                        barLeftColor='#cccccc'
                        barRightColor='#cccccc'
                        thumbLeftColor='#000000'
                        thumbRightColor='#000000'
                        onInput={(e) => {
                          handleInputR(BETA_STRAND, e);
                        }}
                      /><span onClick={() => clearIndividualFilter(BETA_STRAND)}>x</span>
                    </div>
                  </div>
                </div>
                {/* Protein Sequence */}
                <div className={styles.advFilterProteinSequence}>
                  <label>Protein Sequence</label>
                  <textarea rows="2" style={{ width: '100%' }} />
                </div>
                {/* Search */}
                <div className={styles.advFilterSearch}>
                  <div className={styles.HomeSearch}>
                    <button className={styles.HomeSearchButton}>Search</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className={styles.HomeClearSearchButton} onClick={() => resetFilters()}>Reset Filters</button>
        </div>
        <div className={styles.HomeSearchFilters}>
          <div>
            <div className={styles.HomeList}>
              <div className={styles.HomeList}>
                <div className={styles.HomeList}>
                  <div className={styles.HomeLegend}>Search proteins between</div>
                  <div className={styles.HoverContainer}>
                    <div className={styles.FilterProteinLength}>
                      <div className={styles.FilterRangeButton}>
                        <span className={styles.HomeFilterEnabled}>{SEQUENCE_LENGTH.min}</span> and <span className={styles.HomeFilterEnabled}>{SEQUENCE_LENGTH.max}</span>
                      </div>
                    </div>
                    <div className={styles.RangeSelector}>
                      <MultiRangeSlider
                        style={{ border: 'none', boxShadow: 'none', margin: '.4rem', padding: '.5rem', width: '500px', zIndex: 1020 }}
                        // baseClassName='multi-range-slider-black'
                        min={SEQUENCE_LENGTH.range.min}
                        max={SEQUENCE_LENGTH.range.max}
                        step={1}
                        minValue={SEQUENCE_LENGTH.min}
                        maxValue={SEQUENCE_LENGTH.max}
                        label={false}
                        ruler={false}
                        barInnerColor='#8a41ff'
                        barLeftColor='#cccccc'
                        barRightColor='#cccccc'
                        thumbLeftColor='#000000'
                        thumbRightColor='#000000'
                        onInput={(e) => {
                          handleInputR(SEQUENCE_LENGTH, e);
                        }}
                      />
                    </div>
                  </div>
                  <div>amino acids</div>
                </div>
                <div className={styles.HomeList}>
                  <div className={styles.HomeLegend}>with:</div>
                  <button onClick={() => handleBoolean(PDB)} className={PDB.isEnabled ? styles.HomeFilterButtonEnabled : styles.HomeFilterButtonDisabled}>{PDB.displayname}</button>
                  <button onClick={() => handleBoolean(PTM)} className={PTM.isEnabled ? styles.HomeFilterButtonEnabled : styles.HomeFilterButtonDisabled}>{PTM.displayname}</button>
                  <button onClick={() => handleBoolean(SUBTRATE)} className={SUBTRATE.isEnabled ? styles.HomeFilterButtonEnabled : styles.HomeFilterButtonDisabled}>{SUBTRATE.displayname}</button>
                  <button onClick={() => handleBoolean(DISEASES)} className={DISEASES.isEnabled ? styles.HomeFilterButtonEnabled : styles.HomeFilterButtonDisabled}>{DISEASES.displayname}</button>
                </div>
              </div>
            </div>
          </div>
          <button className={styles.HomeSearchButton}>Search</button>
        </div>

        {/* <div className={styles.HomeSearchOptions}>


        </div> */}
      </div>
      <br />

    {/* <div>
      
     
      <button>Search</button>
      clear
      More filters
    </div> */}
      <Container fluid className="main-content-wrapper">
        <Row>
          {/* --------Advance Filter Component----- */}
          <Col md={3} lg={2} className="sidebar-div">
            <AdvanceFilters visible={navVisible} show={showNavbar} filters={filters} onFilterChange={handleFiltersChange} />
          </Col>
          {/* <!--Right Content Section-> */}
          <Col md={9} lg={10} className="right-content-div search-results-div d-flex flex-column flex-column-fluid">
            {/* <!--Header Section--> */}
            {/* <Col md={12} className="content-header-wrapper">
            <div className='header-title col-md-6'>
              <div className='h5'>Search Proteins</div>
              <span>Search Using UniProt ID or use Advance Filters</span>
            </div>
          </Col> */}
            {/* <!--Filters Applied section--> */}
            {/* {Object.keys(filters).length > 0 && <Col md={12} className="fiters-applied-wrapper">
              <div className="fiters-applied-list-div" >
                {getAppliedFilters()}
              </div>
            </Col>} */}

            <Col md={12}>
              <TableComponent
                loading={loading}
                error={error}
              />
            </Col>
          </Col>
        </Row>

      </Container>
    </div>
  )
}

export default Home
