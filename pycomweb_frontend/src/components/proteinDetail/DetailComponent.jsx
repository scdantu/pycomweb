import { Card, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PropTypes from 'prop-types';

const DetailComponent = ({ data }) => {
    const {diseases, ligands, ec_numbers, pdb, organism_id, ptm} = data;
    console.log(JSON.stringify(organism_id))
    return (
        <div>
            {/* <!--Header Section--> */}
            <Col md={12} className="content-header-wrapper mb-0">
                <div className='header-title'>
                    <div className='h4'>{data.protein_name}</div>
                </div>
                <p><strong>UniProt ID:</strong> {data.uniprot_id}</p>
                <p><strong>Sequence Length:</strong> {data.sequence_length} residues</p>
                {/* <p><strong>Neff:</strong>{data.neff}</p> */}
            </Col>
            <Col md={12} className="content-header-wrapper">
                <p><strong>Sequence: </strong>{data.sequence}</p>
            </Col>
            {/* <!--Statistics about the search Data--> */}
            <Col md={12} className="result-statistics-wrapper">
                <div className='protein-detail-cards'>
                    <b>Neff: </b> <span> {data.neff}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Helix Fraction: </b> <span> {data.helix_frac}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Turn Fraction: </b> <span> {data.turn_frac}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Standard Fraction: </b> <span> {data.strand_frac}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Ptm: </b> <span> {data.has_ptm}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>PDB: </b> <span> {data.has_pdb}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Substrate: </b> <span> {data.has_substrate}</span>
                </div>

            </Col>
            <Col md={12} className="protein_detials_lists">
                <Tabs
                    defaultActiveKey="diseases"
                    id="protein-details-tabs"
                    className="mb-3"
                    fill
                    variant="secondary"
                    data-bs-theme="dark"
                >
                    <Tab eventKey="diseases" title={`Diseases: ${diseases.length}`}>
                        <div className='tab-content-div'>
                            {diseases.length ?
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Disease</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {diseases.map(disease => (
                                            <tr key={disease.disease_id}>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disease.disease_id}</td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{disease.disease}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                :
                                <p>No Diseases</p>
                            }
                        </div>

                    </Tab>
                    <Tab eventKey="Ligands" title={`Ligands: ${ligands.length}`}>
                        <div className='tab-content-div'>
                            {ligands.length ?
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Ligand</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ligands.map(ligand => (
                                            <tr key={ligand.id}>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ligand.id}</td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ligand.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                :
                                <p>No Ligands</p>}
                        </div>
                    </Tab>
                    <Tab eventKey="ecnumber" title={`EC Numbers: ${ec_numbers.length}`}>
                        <div className='tab-content-div'>
                            {ec_numbers.length ?
                                <ul>
                                    {ec_numbers.map(ec => (
                                        <li key={ec}>{ec}</li>
                                    ))}
                                </ul>
                                :
                                <p>No EC Numbers</p>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="pdb" title={`PDB: ${pdb.length}`}>
                        <div className='tab-content-div'>
                            {
                                pdb.length ?
                                    <ul>
                                        {pdb.map(pdb_ref => (
                                            <li key={pdb_ref}>{pdb_ref}</li>
                                        ))}
                                    </ul>
                                    :
                                    <p>No PDB refernce found</p>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="organisms" title={`Organisms: ${organism_id.length}`}>
                        <div className='tab-content-div'>
                            {
                                organism_id.length ?
                                    <ul>
                                        <li key={organism_id}>{organism_id}</li>
                                    </ul>
                                    :
                                    <p>No Organisms found</p>
                            }
                        </div>
                    </Tab>

                    <Tab eventKey="ptm" title={`Post-Translational Modifications (PTMs): ${ptm.length}`}>
                        <div className='tab-content-div'>
                            {ptm.length ?
                                <ul>
                                    {ptm.map(ptm_ref => (
                                        <li key={ptm_ref}>{ptm_ref}</li>
                                    ))}
                                </ul>
                                :
                                <p>No PTM</p>
                            }
                        </div>
                    </Tab>
                </Tabs>

            </Col>
        </div >
    );
};

DetailComponent.propTypes = {
    data: PropTypes.object,
  }

export default DetailComponent;