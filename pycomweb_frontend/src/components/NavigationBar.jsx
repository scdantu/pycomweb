import { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import { DownloadContext } from "../context/DownloadContext";
import { useNavigate } from "react-router-dom";
import UniProtIdSearch from "./SearchProteins/UniProtIdSearch";

import styles from "../styles/NavigationBar.module.css";

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

  return (
    <>
      <div className={styles.NavigationBarContainer}>
        <div className={styles.NavigationBarLogo}><span className={styles.NagivationBarLogoHeavy}>PyCom</span><span className={styles.NagivationBarLogoLight}>Web</span></div>
        
        <div className={styles.NavigationBarOptions}>
          
          <UniProtIdSearch />
          <div className={styles.NavigationDownloadLink} onClick={() => navigate("basket")}>
            <div className={styles.downloadIcon}>&#xf090;</div>
            <span className={basketCount > 0 ? (styles.NavigationBarDownloadsCount) : (styles.NavigationBarDownloadsCountHidden)}>{basketCount}</span>
          </div>
          <div className={styles.NavigationLink} onClick={() => navigate('biological_processes')}>
            <span className={styles.materialSymbolsOutline}>&#xe88e;</span>
            <p className={styles.NavigationLinkText}>Data Types</p>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
