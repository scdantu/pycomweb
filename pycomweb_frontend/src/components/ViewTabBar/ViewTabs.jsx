import React, { useContext} from 'react'
import { PyComContext } from '../../context/PyComContext';
import styles from './ViewTabs.module.css'; 
import { useNavigate } from "react-router-dom";

function ViewTabBar() {
  const { proteinTabs, removeProteinFromTabs, updateSelectedProtein } = useContext(PyComContext)
  const navigate = useNavigate();

  const ViewSearch = () => {
    updateSelectedProtein(-1);
    navigate(`/`);
  }

  const RemoveProteinTabAndUpdateView = async (uniprot_id) => {
    const navigationPath = await removeProteinFromTabs(uniprot_id);
    navigate(navigationPath);
  }

  const ViewProtein = (uniprot_id) => {
    updateSelectedProtein(uniprot_id);
    navigate(`protein/${uniprot_id}`)
  }
  

return (
    <React.Fragment>
        <div className={styles.ViewTabs}>
            <div className={styles.ViewTabsSearch} onClick={() => ViewSearch()}>Search</div>
            { proteinTabs.tabs.map((tab, index) => (
                <div key={tab} className={proteinTabs.selectedIndex === index ? styles.ViewTabsProteinSelected : styles.ViewTabsProtein} >&nbsp;
                <span className={styles.ViewTabsProteinLabel}onClick={() =>ViewProtein(tab)}>{tab}</span>
                <span className={styles.ViewTabsRemoveTab} onClick={() => RemoveProteinTabAndUpdateView(tab)}>x</span></div>
            ))}
        </div>
    </React.Fragment>
  )
}

export default ViewTabBar;
