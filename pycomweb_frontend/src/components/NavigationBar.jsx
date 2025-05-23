import { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import { DownloadContext } from "../context/DownloadContext";
import { FaCartArrowDown } from "react-icons/fa";
import UniProtIdSearch from "./SearchProteins/UniProtIdSearch";
import styles from "../styles/NavigationBar.module.css";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const { basket } = useContext(DownloadContext);
  const [basketCount, setBasketCount] = useState(0);

  const navigate = useNavigate();
  const dataTypeListRef = useRef();
  //update the cart count bubble each time an item is added to the basket
  useEffect(() => {
    let basketItems = Object.keys(basket).length;
    setBasketCount(basketItems);
  }, [basket]);

  const handleDataTypeChange = () => {
    // get DataType Ref Value
    const helpType = dataTypeListRef.current.value;
    // if any item has been selected
    if (helpType.selectedIndex !== 0) {
      dataTypeListRef.current.selectedIndex = 0; // reset dropdown to 'Data Types'
      navigate(helpType); // navigate to selected index
    }
  }

  return (
    <>
      <div className={styles.NavigationBarContainer}>
        <div className={styles.NavigationBarLogo}>PyComWeb</div>
        <div className={styles.NavigationBarOptions}>
          <UniProtIdSearch />

          <div>
            <select ref={dataTypeListRef} name="DataType" id="DataType" onChange={() => handleDataTypeChange()} className={styles.NavigationBarDataTypeList}>
              <option value="" hidden disabled selected>Data</option>
              <option value="biological_processes">Biological Processes</option>
              <option value="cellular_components">Cellular Components</option>
              <option value="cofactors">Cofactors</option>
              <option value="diseases">Diseases</option>
              <option value="developmental_stages">Developmental Stages</option>
              <option value="domains">Domains</option>
              <option value="ligands">Ligands</option>
              <option value="molecular_functions">Molecular Functions</option>
              <option value="organisms">Organisms</option>
              <option value="ptm">Post Translational Modification</option>
            </select>
          </div>

          <div className={styles.NavigationBarDownloads} onClick={() => navigate("basket")}>
            <FaCartArrowDown size={20} />
            <span className={basketCount > 0 ? (styles.NavigationBarDownloadsCount) : (styles.NavigationBarDownloadsCountHidden)}>{basketCount}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
