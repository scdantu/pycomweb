import { useContext } from "react";
import { Col, Table } from "react-bootstrap";
import { FaEye, FaFileDownload, FaCartPlus} from 'react-icons/fa';
import { HelpDataContext } from "../../context/HelpDataContext";
import { PyComContext } from "../../context/PyComContext";
import { useNavigate } from "react-router-dom";

const TableComponent = ({ data, loading, error, pagination, onPageChange, onRecordsPerPageChange }) => {
  const {updateBasket} =  useContext(HelpDataContext);
  const {addProteinToTab} = useContext(PyComContext);
  const { results, result_count, total_pages, page } = data || {};

  const navigate = useNavigate();

  const ViewProtein = (uniprot_id) => {
    addProteinToTab(uniprot_id);
    navigate(`protein/${uniprot_id}`)
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (result_count == 0) return <div className="col-md-12"><p>No Results Found</p></div>
  return (
    <>
      <div className="results-table-header col-md-12">
        <Col md-6="true"><span className="h6">Total Records </span><b>{result_count}</b></Col>
        <Col md-3="true">
          <span className="h6">Records per page:</span>
          <select value={pagination.recordsPerPage} width="50" onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </Col>
        <Col md-3="true">
          <span className="h6">Go to Page:</span>
          <input type="number" min="1" max={total_pages} value={page} onChange={(e) => onPageChange(Number(e.target.value))} />
        </Col>
      </div>
      <Col className="pagination col-md-12">
        <button onClick={() => onPageChange(1)} disabled={page === 1}>First</button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
        <span className="h6">Page <b>{page}</b> of <b>{total_pages}</b></span>
        <button onClick={() => onPageChange(page + 1)} disabled={page === total_pages}>Next</button>
        <button onClick={() => onPageChange(total_pages)} disabled={page === total_pages}>Last</button>

      </Col>



      <div className="table-container">
        <Table stripped="true">
          <thead>
            <tr>
              {/* <th>#</th> */}
              <th>UniProt ID</th>
              <th>Sequence Length</th>
              <th>Sequence</th>
              <th>Neff</th>
              <th>Helix Fraction</th>
              <th>Strand Fraction</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results && results.map((row, index) => (
              <tr key={index}>
                {/* <td><input type="checkbox" name="selected_proteins[]" key={row.uniprot_id} /></td> */}
                {/* <td>{((page - 1) * pagination.recordsPerPage) + index + 1}</td> */}
                <td>{row.uniprot_id}</td>
                <td>{row.sequence_length}</td>
                <td>{row.sequence.length > 6 ? row.sequence.substring(0, 6) + "..." : row.sequence}</td>
                <td>{row.neff}</td>
                <td>{row.helix_frac}</td>
                <td>{row.strand_frac}</td>
                <td>
                  {/* <a className="fa-icon" onClick={() => ViewProtein(row.uniprot_id)} href={"/protein/" + row.uniprot_id} target="_blank"><FaEye title="View more" />&nbsp;</a> */}
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
          <button onClick={() => onPageChange(1)} disabled={page === 1}>First</button>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
          <span className="h6">Page <b>{page}</b> of <b>{total_pages}</b></span>
          <button onClick={() => onPageChange(page + 1)} disabled={page === total_pages}>Next</button>
          <button onClick={() => onPageChange(total_pages)} disabled={page === total_pages}>Last</button>
        </Col>
      </div>
    </>
  );
};

export default TableComponent;
