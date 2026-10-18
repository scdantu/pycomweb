import { useContext, useEffect, useMemo, useState } from 'react';
import { Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PropTypes from 'prop-types';
import { DownloadContext } from '../../context/DownloadContext';
import { FaCartPlus } from 'react-icons/fa';
import { RepositoryContext } from '../../context/RepositorContext';
// import useFetchQueryProteins from '../customHooks/useFetchQueryProteins.jsx';
// import  useFetchProteinDetail from '../../customHooks/useFetchProteinDetail.jsx';
import useFetchProteinFullData from '../../customHooks/useFetchProteinFullData.jsx';

const DetailComponent = ({ uniprot_id }) => {

    const { updateBasket } = useContext(DownloadContext);
    const { proteinRepository } = useContext(RepositoryContext);
    const { loadingFull, error } = useFetchProteinFullData(true, [uniprot_id])
    // const [ready, setReady] = useState(false);

    // useEffect(() => {
    //     if (proteinRepository[uniprot_id]?.fullData) {
    //         setReady(true);
    //     }
    // }, [proteinRepository, uniprot_id]);


    const data = proteinRepository[uniprot_id];
    
    const decimalPlaces = 3; //number of decimal places for display

    const roundFigure = (item) => {
        if(item !== 0) {
            return item.toFixed(decimalPlaces);
        }
        return 0;
    }

    const renderTrueFalse = (item) => {
        if(item) {
            return "\u2714"; //unicode check
        } else {
            return "\u2716"; //unicode cross
        }
    }

    const renderLink = (item) => {
        if(item.length > 0) {
            let hrefLink = `https://www.uniprot.org/taxonomy/${item}`
            return (<a className="organism-link" href={hrefLink} target="_blank" rel="noreferrer">{item}</a>);
            
         } else {
             return "\u2716"; //unicode cross
         }
    }

    if(loadingFull) {
        return <div>Loading...</div>;
    }
    if(error) {
        return <div>Error: {error}</div>;
    }
    if (!data) {
       return <div>Initialising protein data…</div>;
    }
    if(!data.summaryData) {
        return <div>No data found for this UniProt ID.</div>;
    }
    if (!data?.fullData) {
        return <div>Loading full data…</div>;
    }
    // if (!ready) return <div>Waiting for protein data...</div>;

    if (!data || !data.fetchedFullData) {
    return <p>Loading protein data...</p>;
  }

    const {
        protein_name = "" ,
        diseases = [],
        ligands = [],
        ec_numbers = [],
        pdb = [],
        ptm = [],
    } = data?.summaryData || {};
    // = data?.summaryData || {};

    const {
        organism_id = "",
        sequence_length = 0,
        sequence = "",
        neff = 0,
        helix_frac = 0,
        turn_frac = 0,
        strand_frac = 0,
        has_ptm = false,
        has_pdb = false,
        has_substrate = false
    } = data?.fullData || {};

    return (
        <div>
            {/* <!--Header Section--> */}
            <Col md={12} className="content-header-wrapper mb-0">
                <div className='header-title'>
                    <div className='h4'>{protein_name}</div>
                </div>
                <p><strong>UniProt ID:</strong> {uniprot_id}</p>
                <p><strong>Sequence Length:</strong> {sequence_length} residues</p>
                <a className="fa-icon" onClick={() => updateBasket(uniprot_id)}><FaCartPlus title="Add to Downloads" />&nbsp; Add to download</a>
                {/* <p><strong>Neff:</strong>{data.neff}</p> */}
            </Col>
            <Col md={12} className="content-header-wrapper">
                <p><strong>Sequence: </strong>{sequence}</p>
            </Col>
            {/* <!--Statistics about the search Data--> */}
            <Col md={12} className="result-statistics-wrapper">
                <div className='protein-detail-cards'>
                    <b>Organism: </b> <span> {renderLink(organism_id)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Neff: </b> <span> {roundFigure(neff)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Helix Fraction: </b> <span> {roundFigure(helix_frac)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Turn Fraction: </b> <span> {roundFigure(turn_frac)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Standard Fraction: </b> <span> {roundFigure(strand_frac)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Ptm: </b> <span> {renderTrueFalse(has_ptm)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>PDB: </b> <span> {renderTrueFalse(has_pdb)}</span>
                </div>
                <div className='protein-detail-cards'>
                    <b>Substrate: </b> <span> {renderTrueFalse(has_substrate)}</span>
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
                    {/* <Tab eventKey="organisms" title={`Organisms: ${organism_id.length}`}>
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
                        </Tab> */}

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
    uniprot_id: PropTypes.string
}

export default DetailComponent;