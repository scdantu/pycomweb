import React, { useState, useEffect } from 'react';
import './Footer.css'; // optional for modal styling

function Footer() {
  const [showModal, setShowModal] = useState(false);

  // Show modal on first load
  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCookiesClick = (e) => {
    e.preventDefault(); // prevent default navigation
    setShowModal(true);
  };

  return (
    <>
      <div className='footer-div'>
        <div className='col-md-2'><small>PyComWeb &copy; 2025</small></div>
        <div>
          <small>This website is free to use for both personal and commercial purposes and is licensed under the GNU General Public License v3 (GPL-3.0).</small>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="/cookies" onClick={handleCookiesClick}>Cookies</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="https://pycom.brunel.ac.uk/privacy.html" target="_blank">Privacy Notice</a>
        </div>
      </div>


      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cookie Notice</h2>
            <div>
              <p>We use cookies to make this website work properly and perform well. These include cookies that help with protein data searching, download management, and overall site operation.</p>
              <p>We also use Google Analytics cookies to understand how people access and use the service (such as pages visited and general location). This information is used solely for statistical reporting and to improve the site.</p>

              <p>We do not collect any personal identifying information.</p>

              <p>By continuing to use this website, you agree to our use of these cookies.</p>
            </div>
            <button onClick={handleClose}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;