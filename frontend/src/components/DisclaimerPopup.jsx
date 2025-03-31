import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DisclaimerPopup() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  const handleAccept = () => {
    setShowPopup(false);
  };

  const handleReject = () => {
    setShowPopup(false);
    navigate("/about");
  };

  return (
    <div className={`fixed inset-0 z-50 ${showPopup ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"> 
          <p className="text-blue mb-4 font-bold"><strong>Disclaimer:</strong></p>
          <p className="text-gray-800 mb-4 text-justify">
            As per the regulations of the <strong>Bar Council of India</strong> and other governing legal authorities, law firms are <strong>not permitted</strong> to solicit work or advertise their services in any form.
            <br /><br />
            By clicking the <strong>"Agree"</strong> button and accessing this website, the visitor fully acknowledges and accepts that:
            <br /><br />
            1. The content provided on this website is <strong>purely for informational purposes</strong> and should <strong>not</strong> be considered as solicitation, advertisement, or legal advice.
            <br /><br />
            2. The firm <strong>does not assume liability</strong> for any decisions made by visitors based on the information available on this site.
            <br /><br />
            3. For any legal concerns or issues, visitors are <strong>strongly encouraged</strong> to seek <strong>independent legal counsel</strong> before making any legal decisions.
            <br /><br />
            If you agree to proceed under these terms, please click <strong>"Agree"</strong> to continue. Otherwise, click <strong>"Disagree"</strong> to exit the website.
          </p>
          <div className="flex justify-end gap-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAccept}
            >
              Agree
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleReject}
            >
              Disagree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisclaimerPopup;
