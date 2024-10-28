import { useState,useRef } from "react";
import { Accordion, Form, Row, Col, Button } from "react-bootstrap";
//import AsyncSelect from 'react-select';
import "../../../src/assets/css/advanceFilters.css";

//import useFetchHelpData from "../../customHooks/useFetchHelpData";


function AdvanceFilters({ filters, onFilterChange }) {
    // const organismFilterData = useFetchHelpData('organisms', 'get-organism-list')
    // const formRef = useRef();

    const [formData, setFormData] = useState({});
    const [isFormChanged, setIsFormChanged] = useState(false);
    const advancedFilterFormRef = useRef();
    
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (type === 'checkbox') {
            if (checked) {
                // Add filter to state if checkbox is checked
                setFormData((prevFilters) => ({
                    ...prevFilters,
                    [name]: value,
                }));
            } else {
                // Remove filter from state if checkbox is unchecked
                setFormData((prevFilters) => {
                    const { [name]: _, ...restFilters } = prevFilters;
                    return restFilters;
                });
            }
        } else {
            // Update other types of inputs
            setFormData((prevFilters) => ({
                ...prevFilters,
                [name]: value,
            }));
        }
        setIsFormChanged(true);
    };

    const handleApplyFilters = () => {
        onFilterChange(formData);
        setIsFormChanged(false);
    };

    const handleClearFilters = () => {
        setFormData({})
        // onFilterChange(formData);
        onFilterChange({});
        setIsFormChanged(false);
        advancedFilterFormRef.current.reset();
    }


    return (
        <>
            <div className="advance-filter-heading">
                <h2>Advanced Filters</h2>
                <Col sm={{ span: 10 }} className="advance-filter-buttons-div">
                    <Button onClick={handleApplyFilters} disabled={!isFormChanged}>Apply</Button>
                    <Button onClick={handleClearFilters}>Clear</Button>
                </Col>
            </div>
            <Form ref={advancedFilterFormRef}>
                <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item eventKey="0" className="item">
                        <Accordion.Header>Options</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="typeOPtions" className="mb-3">
                                <Col sm={10}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Has PDB"
                                        name="has_pdb"
                                        id="has_pdb"
                                        value="1"
                                        onChange={handleChange}
                                    // defaultChecked={filters[key] || false}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Has PTM"
                                        name="has_ptm"
                                        id="type2"
                                        value="1"
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Has Substrate"
                                        name="has_substrate"
                                        id="has_substrate"
                                        value="1"
                                        onChange={handleChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Has Diseases"
                                        name="has_disease"
                                        id="has_disease"
                                        value="1"
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1" className="item">
                        <Accordion.Header>Protein Sequence</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="sequence">
                                {/* <Form.Label column sm={2}>Keyword</Form.Label> */}
                                <Col>
                                    {/* <Form.Control type="text" placeholder="Enter keyword" maxLength="500" /> */}
                                    <Form.Control as="textarea" rows={3} placeholder="Enter complete sequence" name="sequence" onChange={handleChange} defaultValue={filters.sequence || ''} />
                                </Col>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="item">
                        <Accordion.Header>Sequence Length</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="sequence_length" className="mb-3">
                                {/* <div className="mb-3">
                                    <label className="form-label">Exact Length</label>
                                    <input type="number" className="form-control" id="sequence_length" placeholder="Enter exact length" />
                                </div> */}

                                {/* <!-- Minimum Length --> */}
                                {/* <div className="mb-3">
                                    <label className="form-label">Minimum Length</label>
                                    <input type="number" name="min_length" onChange={handleChange} className="form-control" id="min_length" placeholder="Enter minimum length" />
                                </div> */}

                                {/* <!-- Maximum Length --> */}
                                {/* <div className="mb-3">
                                    <label className="form-label">Maximum Length</label>
                                    <input type="number" name="max_length" onChange={handleChange} className="form-control" id="max_length" placeholder="Enter maximum length" />
                                </div> */}

                                {/* <!-- Range --> */}
                                <div className="mb-3">
                                    <label className="form-label">Length Range</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="min_length" name="min_length" onChange={handleChange} placeholder="Min" />
                                        <span className="input-group-text">to</span>
                                        <input type="number" className="form-control" id="max_length" name="max_length" onChange={handleChange} placeholder="Max" />
                                    </div>
                                </div>

                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3" className="item">
                        <Accordion.Header>Helical Structure (%)</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Helical_structure" className="mb-3">
                                {/* <!-- Range --> */}
                                <div className="mb-3">
                                    <label className="form-label">Length Range</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="min_helix" name="min_helix" onChange={handleChange} placeholder="Min" />
                                        <span className="input-group-text">to</span>
                                        <input type="number" className="form-control" id="max_helix" name="max_helix" onChange={handleChange} placeholder="Max" />
                                    </div>
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4" className="item">
                        <Accordion.Header>Turn Structure (%)</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Turn_structure" className="mb-3">
                                {/* <!-- Range --> */}
                                <div className="mb-3">
                                    <label className="form-label">Length Range</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="min_turn" onChange={handleChange} placeholder="Min" />
                                        <span className="input-group-text">to</span>
                                        <input type="number" className="form-control" id="max_turn" onChange={handleChange} placeholder="Max" />
                                    </div>
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="5" className="item">
                        <Accordion.Header>Beta Strand(%)</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="beta_strand" className="mb-3">
                                {/* <!-- Range --> */}
                                <div className="mb-3">
                                    <label className="form-label">Length Range</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="min_strand" name="min_strand" onChange={handleChange} placeholder="Min" />
                                        <span className="input-group-text">to</span>
                                        <input type="number" className="form-control" id="max_strand" name="max_strand" onChange={handleChange} placeholder="Max" />
                                    </div>
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="6" className="item">
                        <Accordion.Header>CATH</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Cath" className="mb-3">
                                <div className="mb-3">
                                    <input className="form-control" id="cath" name="cath" onChange={handleChange} placeholder="3.*.*.*" />
                                    <span>Example: 3.* OR 3.4.*.* OR 3.4.52.45  </span>
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="7" className="item">
                        <Accordion.Header>Enzyme Commision</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="enzyme" className="mb-3">
                                <div className="mb-3">
                                    <input className="form-control" id="enzyme" name="enzyme" onChange={handleChange} placeholder="3.*.*.*" />
                                    <span>Example: 3.* OR 3.4.*.* OR 3.4.52.45  </span>
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="8" className="item">
                        <Accordion.Header>Organism</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Organism ID" className="mb-3">
                                <div className="mb-3">
                                    <label className="form-label">Organism ID</label>
                                    <input type="text" className="form-control" id="organism_id" name="organism_id" onChange={handleChange} placeholder="ID" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Organism Name</label>
                                    <input type="text" className="form-control" id="organism_name" name="organism_name" onChange={handleChange} placeholder="homo" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="9" className="item">
                        <Accordion.Header>Disease</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Organism ID" className="mb-3">
                                <div className="mb-3">
                                    <label className="form-label">Disease ID</label>
                                    <input type="text" className="form-control" id="disease_id" name="disease_id" onChange={handleChange} placeholder="00097" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Disease</label>
                                    <input type="text" className="form-control" id="disease" name="disease" onChange={handleChange} placeholder="alzheimer" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="10" className="item">
                        <Accordion.Header>Cofactor</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Cofactor ID" className="mb-3">
                                <div className="mb-3">
                                    <label className="form-label">Cofactor ID</label>
                                    <input type="text" className="form-control" id="cofactor_id" name="cofactor_id" onChange={handleChange} placeholder="60240" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cofactor</label>
                                    <input type="text" className="form-control" id="cofactor" name="cofactor" onChange={handleChange} placeholder="heme" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="11" className="item">
                        <Accordion.Header>Biological Process</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="biological_process" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="biological_process" name="biological_process" onChange={handleChange} placeholder="acute" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="12" className="item">
                        <Accordion.Header>Cellular Component</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="Cellular Component" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="cellular_component" name="cellular_component" onChange={handleChange} placeholder="biosynthesis" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="13" className="item">
                        <Accordion.Header>Developmental Stage</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="developmental_stage" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="developmental_stage" name="developmental_stage" onChange={handleChange} placeholder="early" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="14" className="item">
                        <Accordion.Header>Domain</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="domain" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="domain" name="domain" onChange={handleChange} placeholder="bromodomain" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="15" className="item">
                        <Accordion.Header>Ligand</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="ligand" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="ligand" name="ligand" onChange={handleChange} placeholder="biotin" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="16" className="item">
                        <Accordion.Header>Molecular Function</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="molecular_function" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="molecular_function" name="molecular_function" onChange={handleChange} placeholder="activator" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="17" className="item">
                        <Accordion.Header>post-translational modification</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group as={Row} controlId="ptm" className="mb-3">
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="ptm" name="ptm" onChange={handleChange} placeholder="bromination" />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                    {/* <Accordion.Item eventKey="2" className="item">
                        <Accordion.Header>Select Box </Accordion.Header>
                        <Accordion.Body>
                            {/* Select Box */}
                    {/* <Form.Group as={Row} controlId="categorySelect" className="mb-3">
                        <Form.Label column sm={2}>Category</Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select">
                                <option>Select category</option>
                                <option value="1">Category 1</option>
                                <option value="2">Category 2</option>
                                <option value="3">Category 3</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                </Accordion.Body>
            </Accordion.Item> */}
                </Accordion >
            </Form >
        </>
    );
}

export default AdvanceFilters;
