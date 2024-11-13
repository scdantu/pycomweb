import { useState, useRef, useContext } from "react";
import { Accordion, Form, Row, Col, Button } from "react-bootstrap";
// import { FaSearch } from 'react-icons/fa';
// import AsyncSelect from 'react-select';
import "../../../src/assets/css/advanceFilters.css";

import { validateField, validateForm } from "./ValidateSearchProteinFilters";
import { SearchContext } from "../../context/SearchContext";

function AdvanceFilters({ filters, onFilterChange }) {
    const {isFormChanged, setIsFormChanged} = useContext(SearchContext);
    const {isSearchUpdateRequired, setIsSearchUpdateRequired} = useContext(SearchContext);

    const [formData, setFormData] = useState({});
    const advancedFilterFormRef = useRef();
    const [errors, setErrors] = useState({});

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

            if (value == '' || value == 'undefined') {
                //why do we have this space?
            }
            // Update other types of inputs
            setFormData((prevFilters) => ({
                ...prevFilters,
                [name]: value,
            }));
        }
        // Clear error for the field being edited
        setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        setIsFormChanged(true);
    };

    // Validate on blur
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const fieldErrors = validateField(name, value, formData);
        // if error then, disable apply button
        if (fieldErrors[name]) {
            setIsFormChanged(false);
        }
        // update or insert the error in Errors state
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...fieldErrors,
        }));
    };


    // FUNCTIONS NOT BEING USED

    // called by search button next to UniProt ID input field
    // const handleSearchBtn = () => {
    //     // const newFilters = { ...filters, uniprot_id }
    //     handleFiltersChange(filters);
    // }

    // called when user presses enter button ater typing UniprotID
    // const handleSearchBoxKeyDown = (event) => {
    //     if (event.key == "Enter") {
    //         handleFiltersChange(filters);
    //     }
    // }

    const handleApplyFilters = () => {
        const formErrors = validateForm(formData);
        setErrors(formErrors);
        // console.log("five")
        // console.log(errors)
        if (Object.keys(formErrors).length === 0) {
            // console.log('Form submitted successfully!', formData);
            onFilterChange(formData);
        }
        setIsSearchUpdateRequired(true);
        setIsFormChanged(false);
    };

    const handleClearFilters = () => {
        setFormData({})
        setErrors({});
        onFilterChange({});
        setIsSearchUpdateRequired(true);
        setIsFormChanged(false);
        advancedFilterFormRef.current.reset();
        // reset state of checkboxes to false to update the state
        Object.keys(advancedFilterFormRef.current).forEach((key) => {
            // console.log(key)
            if (advancedFilterFormRef.current[key].type == 'checkbox') {
                advancedFilterFormRef.current[key].checked = false;
            }
        });
    }

    return (
        <>
            <Form ref={advancedFilterFormRef}>
                <div className="advance-filter-heading">
                    <h2>Advanced Filters</h2>
                    <Col sm={{ span: 10 }} className="advance-filter-buttons-div">
                        <Button onClick={handleApplyFilters} disabled={!isFormChanged}>Apply</Button>
                        <Button onClick={handleClearFilters}>Clear</Button>
                    </Col>
                </div>
                <div className="advance-filters-div">
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
                                        <Form.Control as="textarea" rows={3} placeholder="Enter complete sequence"
                                            name="sequence"
                                            onChange={handleChange}
                                            defaultValue={filters.sequence || ''}
                                            onBlur={handleBlur}
                                        />
                                    </Col>
                                    {errors.sequence && <span className="error-message">{errors.sequence}</span>}
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
                                            <input type="number" className="form-control" id="min_length" name="min_length" onChange={handleChange} onBlur={handleBlur} placeholder="Min" />
                                            <span className="input-group-text">to</span>
                                            <input type="number" className="form-control" id="max_length" name="max_length" onChange={handleChange} onBlur={handleBlur} placeholder="Max" />
                                        </div>
                                    </div>
                                    {errors.min_length && <span className="error-message">{errors.min_length}</span>}
                                    {errors.max_length && <span className="error-message">{errors.max_length}</span>}
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
                                            <input type="number" className="form-control" id="min_helix" name="min_helix" onChange={handleChange} onBlur={handleBlur} placeholder="Min" />
                                            <span className="input-group-text">to</span>
                                            <input type="number" className="form-control" id="max_helix" name="max_helix" onChange={handleChange} onBlur={handleBlur} placeholder="Max" />
                                        </div>
                                    </div>
                                    {errors.min_helix && <span className="error-message">{errors.min_helix}</span>}
                                    {errors.max_helix && <span className="error-message">{errors.max_helix}</span>}
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
                                            <input type="number" className="form-control" id="min_turn" onChange={handleChange} onBlur={handleBlur} placeholder="Min" />
                                            <span className="input-group-text">to</span>
                                            <input type="number" className="form-control" id="max_turn" onChange={handleChange} onBlur={handleBlur} placeholder="Max" />
                                        </div>
                                    </div>
                                    {errors.min_turn && <span className="error-message">{errors.min_turn}</span>}
                                    {errors.max_turn && <span className="error-message">{errors.max_turn}</span>}
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
                                            <input type="number" className="form-control" id="min_strand" name="min_strand" onChange={handleChange} onBlur={handleBlur} placeholder="Min" />
                                            <span className="input-group-text">to</span>
                                            <input type="number" className="form-control" id="max_strand" name="max_strand" onChange={handleChange} onBlur={handleBlur} placeholder="Max" />
                                        </div>
                                    </div>
                                    {errors.min_strand && <span className="error-message">{errors.min_strand}</span>}
                                    {errors.max_strand && <span className="error-message">{errors.max_strand}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="6" className="item">
                            <Accordion.Header>CATH</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="Cath" className="mb-3">
                                    <div className="mb-3">
                                        <input className="form-control" id="cath" name="cath" onChange={handleChange} onBlur={handleBlur} placeholder="3.*.*.*" />
                                        <span>Example: 3.* OR 3.4.*.* OR 3.4.52.45  </span>
                                    </div>
                                    {errors.cath && <span className="error-message">{errors.cath}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="7" className="item">
                            <Accordion.Header>Enzyme Commision</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="enzyme" className="mb-3">
                                    <div className="mb-3">
                                        <input className="form-control" id="enzyme" name="enzyme" onChange={handleChange} onBlur={handleBlur} placeholder="3.*.*.*" />
                                        <span>Example: 3.* OR 3.4.*.* OR 3.4.52.45  </span>
                                    </div>
                                    {errors.enzyme && <span className="error-message">{errors.enzyme}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="8" className="item">
                            <Accordion.Header>Organism</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="Organism ID" className="mb-3">
                                    <div className="mb-3">
                                        <label className="form-label">Organism ID</label>
                                        <input type="text" className="form-control" id="organism_id" name="organism_id" onChange={handleChange} onBlur={handleBlur} placeholder="ID" />
                                    </div>
                                    {errors.organism_id && <span className="error-message">{errors.organism_id}</span>}
                                    <div className="mb-3">
                                        <label className="form-label">Organism Name</label>
                                        <input type="text" className="form-control" id="organism_name" name="organism_name" onChange={handleChange} onBlur={handleBlur} placeholder="homo" />
                                    </div>
                                    {errors.organism_name && <span className="error-message">{errors.organism_name}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="9" className="item">
                            <Accordion.Header>Disease</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="Disease ID" className="mb-3">
                                    <div className="mb-3">
                                        <label className="form-label">Disease ID</label>
                                        <input type="text" className="form-control" id="disease_id" name="disease_id" onChange={handleChange} onBlur={handleBlur} placeholder="00097" />
                                    </div>
                                    {errors.disease_id && <span className="error-message">{errors.disease_id}</span>}
                                    <div className="mb-3">
                                        <label className="form-label">Disease</label>
                                        <input type="text" className="form-control" id="disease" name="disease" onChange={handleChange} onBlur={handleBlur} placeholder="alzheimer" />
                                    </div>
                                    {errors.disease && <span className="error-message">{errors.disease}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="10" className="item">
                            <Accordion.Header>Cofactor</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="Cofactor ID" className="mb-3">
                                    <div className="mb-3">
                                        <label className="form-label">Cofactor ID</label>
                                        <input type="text" className="form-control" id="cofactor_id" name="cofactor_id" onChange={handleChange} onBlur={handleBlur} placeholder="CHEBI:60240" />
                                    </div>
                                    {errors.cofactor_id && <span className="error-message">{errors.cofactor_id}</span>}
                                    <div className="mb-3">
                                        <label className="form-label">Cofactor</label>
                                        <input type="text" className="form-control" id="cofactor" name="cofactor" onChange={handleChange} onBlur={handleBlur} placeholder="heme" />
                                    </div>
                                    {errors.cofactor && <span className="error-message">{errors.cofactor}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="11" className="item">
                            <Accordion.Header>Biological Process</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="biological_process" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="biological_process" name="biological_process" onChange={handleChange} onBlur={handleBlur} placeholder="acute" />
                                    </div>
                                    {errors.biological_process && <span className="error-message">{errors.biological_process}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="12" className="item">
                            <Accordion.Header>Cellular Component</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="Cellular Component" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="cellular_component" name="cellular_component" onChange={handleChange} onBlur={handleBlur} placeholder="biosynthesis" />
                                    </div>
                                    {errors.cellular_component && <span className="error-message">{errors.cellular_component}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="13" className="item">
                            <Accordion.Header>Developmental Stage</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="developmental_stage" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="developmental_stage" name="developmental_stage" onChange={handleChange} onBlur={handleBlur} placeholder="early" />
                                    </div>
                                    {errors.developmental_stage && <span className="error-message">{errors.developmental_stage}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="14" className="item">
                            <Accordion.Header>Domain</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="domain" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="domain" name="domain" onChange={handleChange} onBlur={handleBlur} placeholder="bromodomain" />
                                    </div>
                                    {errors.domain && <span className="error-message">{errors.domain}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="15" className="item">
                            <Accordion.Header>Ligand</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="ligand" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="ligand" name="ligand" onChange={handleChange} onBlur={handleBlur} placeholder="biotin" />
                                    </div>
                                    {errors.ligand && <span className="error-message">{errors.ligand}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="16" className="item">
                            <Accordion.Header>Molecular Function</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="molecular_function" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="molecular_function" name="molecular_function" onChange={handleChange} onBlur={handleBlur} placeholder="activator" />
                                    </div>
                                    {errors.molecular_function && <span className="error-message">{errors.molecular_function}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="17" className="item">
                            <Accordion.Header>post-translational modification</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group as={Row} controlId="ptm" className="mb-3">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="ptm" name="ptm" onChange={handleChange} onBlur={handleBlur} placeholder="bromination" />
                                    </div>
                                    {errors.ptm && <span className="error-message">{errors.ptm}</span>}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion >
                </div >
            </Form >
        </>
    );
}

export default AdvanceFilters;
