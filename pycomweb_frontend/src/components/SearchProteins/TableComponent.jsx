import { useContext } from "react";
import { Col, Table } from "react-bootstrap";
import { FaEye, FaFileDownload, FaCartPlus} from 'react-icons/fa';
import { DownloadContext } from "../../context/DownloadContext";
import { SearchContext } from "../../context/SearchContext";
// import { HelpDataContext } from "../../context/HelpDataContext";
// import { PyComContext } from "../../context/PyComContext";
// import { RepositoryContext } from "../../context/RepositorContext";
import { useNavigate } from "react-router-dom";
import { ProteinTabContext } from "../../context/ProteinTabContext";

import styles from "../../styles/ComponentTable.module.css";

// const TableComponent = ({ data, loading, error, pagination2, onPageChange, onRecordsPerPageChange }) => {
const TableComponent = ({ loading, error }) => {

  const {updateBasket} =  useContext(DownloadContext);
  // const {addProteinToTab} = useContext(PyComContext);
  // const {addProteinToTab} = useContext(RepositoryContext);
  const {addProteinToTab, addProteinToTabAndNavigate} = useContext(ProteinTabContext);
  // const { results, result_count, total_pages, page } = data || {};

  const {searchData, pagination, handlePageChange, handleRecordsPerPageChange} = useContext(SearchContext);
  const { results, result_count, total_pages, page } = searchData || {};

  const navigate = useNavigate();

  const ViewProtein = (uniprot_id) => {
    addProteinToTabAndNavigate(uniprot_id);
    navigate(`protein/${uniprot_id}`)
  }
  const AddProtein = (uniprot_id) => {
    addProteinToTab(uniprot_id);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (result_count == 0) return <div className="col-md-12"><p>No Results Found</p></div>
  
  return (
    <>
      <div style={{ display: "flex", alignItems: 'flex-end', justifyContent: "space-between", margin: "0px 1rem", marginBottom: ".5rem", paddingBottom: "1rem", borderBottom: "1px solid #ededed"}}>
        <div>Total Records: <span style={{fontWeight: "700"}}>{result_count}</span></div>
        <div>Records per page:&nbsp;<span style={{ border: "1px solid #dddddd", backgroundColor: '#f6f6f6', borderRadius: '1rem', fontWeight: '600', margin: '0rem', padding: '.2rem .7rem'}}>
          <select id="results"  style={{backgroundColor: 'transparent', fontWeight: '600', textAlign: 'center'}} value={pagination.recordsPerPage} onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select></span></div>
      </div>

      {/* <div className="results-table-header col-md-12" style={{margin: "0px 1rem"}}>
        <Col md-6="true"><span className="h6">Total Records </span><b>{result_count}</b></Col>
        
        <Col md-6="true">
          <span className="h6">Records per page:</span>
          <select value={pagination.recordsPerPage} width="50" onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </Col>
      </div> */}
      
      <div className="table-container" style={{margin: "0px 1rem"}}>
        <Table stripped="true">
          <thead>
            <tr>
              {/* <th>#</th> */}
              <th>UniProt ID</th>
              <th>Sequence</th>
              <th className="table-header-font">Length</th>
              <th className="table-header-font">N<sup>eff</sup></th>
              <th className="table-header-font">Helix Fraction</th>
              <th className="table-header-font">Strand Fraction</th>
              <th className="table-header-font">Actions</th>
            </tr>
          </thead>
          <tbody className="mono-font">
            {results && results.map((row, index) => (
              <tr key={index}>
                {/* <td><input type="checkbox" name="selected_proteins[]" key={row.uniprot_id} /></td> */}
                {/* <td>{((page - 1) * pagination.recordsPerPage) + index + 1}</td> */}
                <td className="text-left">{row.uniprot_id}</td>
                <td className="text-left">{row.sequence.length > 6 ? row.sequence.substring(0, 6) + "..." : row.sequence}</td>
                <td>{row.sequence_length}</td>
                <td>{row.neff.toFixed(2)}</td>
                <td>{row.helix_frac.toFixed(2)}</td>
                <td>{row.strand_frac.toFixed(2)}</td>
                <td>
                  {/* <a className="fa-icon" onClick={() => ViewProtein(row.uniprot_id)} href={"/protein/" + row.uniprot_id} target="_blank"><FaEye title="View more" />&nbsp;</a> */}
                  <a className="fa-icon" onClick={() => AddProtein(row.uniprot_id)}><FaEye title="View more" />&nbsp;</a>
                  <a className="fa-icon" onClick={() => ViewProtein(row.uniprot_id)}><FaEye title="View more" />&nbsp;</a>
                  <a className="fa-icon" href={"https://pycom.brunel.ac.uk/alignments/" + row.uniprot_id + ".aln"} >
                    <FaFileDownload title="Download MSA file" />&nbsp;
                  </a>
                  <a className="fa-icon"><FaCartPlus title="Add to Download Selection" onClick={() => updateBasket(row.uniprot_id)}/>&nbsp;</a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Col className="pagination col-md-12">
          <button onClick={() => handlePageChange(1)} disabled={page === 1}>First</button>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
          <span className="h6">Page <b>{page}</b> of <b>{total_pages}</b></span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page === total_pages}>Next</button>
          <button onClick={() => handlePageChange(total_pages)} disabled={page === total_pages}>Last</button>
        </Col>
      </div>
    </>
  );
};

export default TableComponent;
