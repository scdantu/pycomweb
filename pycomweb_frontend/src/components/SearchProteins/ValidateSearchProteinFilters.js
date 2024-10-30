export const validationRules = {
    sequence: {
        label: 'Protein Sequence',
        rules: { regex: /^[ACDEFGHIKLMNPQRSTVWY]+$/i, max_char: 500 }
    },
    min_length: {
        label: 'Minimum Sequence Length',
        rules: { min: 1, less_than_equal_to: "max_length", max: 500 }
    },
    max_length: {
        label: "Maximum Sequence Length",
        rules: { min: 1, greater_than_equal_to: "min_length", max: 500 }
    },
    min_helix: {
        label: "Minimum Helix",
        rules: { less_than_equal_to: "max_helix" }
    },
    max_helix: {
        label: "Maximum Helix",
        rules: { greater_than_equal_to: "min_helix" }
    },
    min_turn: {
        label: "Minimum Turn",
        rules: { less_than_equal_to: "max_turn" }
    },
    max_turn: {
        label: "Maximum Turn",
        rules: { greater_than_equal_to: "min_turn" }
    },
    min_strand: {
        label: "Minimum Strand",
        rules: { less_than_equal_to: "max_strand" }
    },
    max_strand: {
        label: "Maximum Strand",
        rules: { greater_than_equal_to: "min_strand" }
    },
    cath: {
        label: 'Cath',
        rules: { regex: /^(\d+)\.?(\d+|\*)?\.?(\d+|\*)?\.?(\d+|\*)?$/ }
    },
    enzyme: {
        label: 'Enzyme',
        rules: {}
    },
    organism_id: {
        label: 'Organism ID',
        rules: {}
    },
    organism_name: {
        label: 'Organism',
        rules: {}
    },
    disease_id: {
        label: 'Disease ID',
        rules: {}
    },
    disease: {
        label: 'Disease',
        rules: {}
    },
    cofactor_id: {
        label: 'Cofactor ID',
        rules: {}
    },
    cofactor: {
        label: 'Cofactor',
        rules: {}
    },
    biological_process: {
        label: 'Biological Process',
        rules: {}
    },
    cellular_component: {
        label: 'Cellular Component',
        rules: {}
    },
    developmental_stage: {
        label: 'Stage',
        rules: {}
    },
    domain: {
        label: 'Domain',
        rules: {}
    },
    ligand: {
        label: 'Ligand',
        rules: {}
    },
    molecular_function: {
        label: 'Function',
        rules: {}
    },
    ptm: {
        label: 'PTM',
        rules: {}
    }

};

export const validateField = (name, value, formData) => {
    let error = {};
    if (!validationRules[name]) {
        return error;
    }
    const { label, rules } = validationRules[name];
    console.log(rules)
    /* IF Field value is empty then don't check for further errors  */
    if (rules == 'undefined' || value == '') {
        error[name] = ""
    } else if (rules.min_char && value.length < rules.min_char) {
        error[name] = `${label} must be at least ${rules.min} characters.`;
    } else if (rules.max_char && value.length > rules.max_char) {
        error[name] = `${label} must not exceed ${rules.max} characters.`;
    } else if (rules.min && value < rules.min) {
        error[name] = `${label} must not be less than than ${rules.min}.`;
    } else if (rules.max && value > rules.max) {
        error[name] = `${label} must not be greater than ${rules.max}.`;
    } else if (rules.regex && !rules.regex.test(value)) {
        error[name] = `${label} is not in the correct format.`;
    } else if (rules.less_than_equal_to && formData[rules.less_than_equal_to] && parseFloat(value) > parseFloat(formData[rules.less_than_equal_to])) {
        error[name] = `${label} must be less than ${validationRules[rules.less_than_equal_to].label}.`;
    } else if (rules.greater_than_equal_to && formData[rules.greater_than_equal_to] && parseFloat(value) < parseFloat(formData[rules.greater_than_equal_to])) {
        error[name] = `${label} must be greater than ${validationRules[rules.greater_than_equal_to].label}.`;
    }
    return error;
};

export const validateForm = (formData) => {
    const errors = {};
    for (const [name, value] of Object.entries(formData)) {
        const fieldErrors = validateField(name, value, formData);
        if (fieldErrors[name] != "") {
            Object.assign(errors, fieldErrors);
        } else {
            delete errors[name];
        }

    }
    return errors;
}
