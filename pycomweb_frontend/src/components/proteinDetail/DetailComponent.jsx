import { Card, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const DetailComponent = ({ data }) => {
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
                    <Tab eventKey="diseases" title="Diseases">
                        <div className='tab-content-div'>
                            {data.diseases.length ?
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Disease</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.diseases.map(disease => (
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
                    <Tab eventKey="Ligands" title="Ligands">
                        <div className='tab-content-div'>
                            {data.ligands.length ?
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Ligand</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.ligands.map(ligand => (
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
                    <Tab eventKey="ecnumber" title="EC Numbers">
                        <div className='tab-content-div'>
                            {data.ec_numbers.length ?
                                <ul>
                                    {data.ec_numbers.map(ec => (
                                        <li key={ec}>{ec}</li>
                                    ))}
                                </ul>
                                :
                                <p>No EC Numbers</p>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="pdb" title="PDB">
                        <div className='tab-content-div'>
                            {
                                data.pdb.length ?
                                    <ul>
                                        {data.pdb.map(pdb => (
                                            <li key={pdb}>{pdb}</li>
                                        ))}
                                    </ul>
                                    :
                                    <p>No PDB refernce found</p>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="organisms" title="Organisms">
                        <div className='tab-content-div'>
                            {
                                data.organism_id.length ?
                                    <ul>
                                        <li key={data.organism_id}>{data.organism_id}</li>
                                    </ul>
                                    :
                                    <p>No Organisms found</p>
                            }
                        </div>
                    </Tab>

                    <Tab eventKey="ptm" title="Post-Translational Modifications (PTMs)">
                        <div className='tab-content-div'>
                            {data.ptm.length ?
                                <ul>
                                    {data.ptm.map(ptm => (
                                        <li key={ptm}>{ptm}</li>
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

export default DetailComponent;