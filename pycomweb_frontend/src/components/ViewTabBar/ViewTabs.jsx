import React, { useContext } from 'react'
import { ProteinTabContext } from '../../context/ProteinTabContext';
import styles from '../../styles/ViewTabs.module.css'; 
import { useNavigate } from "react-router-dom";

function ViewTabBar() {
  const { proteinTabs, removeProteinFromTabs, updateSelectedProtein } = useContext(ProteinTabContext);
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
        <div className={proteinTabs.selectedIndex === -1 ? styles.ViewTabsSearchSelected : styles.ViewTabsSearch} onClick={() => ViewSearch()}>Search</div>
        <div className={styles.ViewTabsProteinTabs}>
          {proteinTabs.tabs.map((tab, index) => (
            <div key={tab} className={proteinTabs.selectedIndex === index ? styles.ViewTabsTabProteinSelected : styles.ViewTabsTabProtein} onClick={() => ViewProtein(tab)}>
              {tab}
              <span className={proteinTabs.selectedIndex === index ? styles.ViewTabsTabCloseSelected : styles.ViewTabsTabClose} onClick={() => RemoveProteinTabAndUpdateView(tab)}>x</span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}

export default ViewTabBar;
