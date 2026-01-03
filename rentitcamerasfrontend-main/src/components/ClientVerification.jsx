import React, { useState } from 'react';
import { CheckCircle, Shield, X, AlertCircle, Copy, Check } from 'lucide-react';
import axios from 'axios';
import Header from './Header';

const API_BASE_URL = 'http://localhost:5000/api';

const ID_VERIFICATION_URLS = {
  aadhaar: 'https://myaadhaar.uidai.gov.in/verifyAadhaar',
  voterId: 'https://electoralsearch.eci.gov.in/',
  drivingLicence: 'https://parivahan.gov.in/rcdlstatus/?pur_cd=101',
  rationCard: 'https://nfsa.bih.nic.in/',
  panCard: 'https://www.incometaxindiaefiling.gov.in/',
  vehicleRegistration: 'https://vahan.nic.in/',
};

export default function ClientVerification({ hideHeader = false }) {
  const [formData, setFormData] = useState({
    clientName: '',
    mobileNumber: '',
    idType: '',
    idNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [showIframe, setShowIframe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.idType) {
      newErrors.idType = 'Please select an ID type';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowIframe(true);
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
  };

  const handleSaveRecord = async () => {
    setSaveMessage(null);
    setIsSaving(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/client-verification`, {
        clientName: formData.clientName,
        mobileNumber: formData.mobileNumber,
        idType: formData.idType,
        idNumber: formData.idNumber,
      });

      if (response.data) {
        setSaveMessage({
          type: 'success',
          text: 'Verification record saved successfully!',
        });

        setTimeout(() => {
          handleReset();
          setSaveMessage(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving verification:', err);
      let errorMessage = 'Failed to save record. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          errorMessage = 'Server endpoint not found. Please ensure the server is running and restarted.';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.message || 'Invalid data. Please check all fields.';
        } else if (err.response.status === 500) {
          errorMessage = err.response.data?.message || 'Server error. Please try again later.';
        } else {
          errorMessage = err.response.data?.message || err.message;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please ensure the server is running on port 5000.';
      } else {
        // Error setting up the request
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      setSaveMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: '',
      mobileNumber: '',
      idType: '',
      idNumber: '',
    });
    setErrors({});
    setShowIframe(false);
    setCopiedField(null);
  };

  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedField(fieldName);
        setTimeout(() => {
          setCopiedField(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const content = (
    <div className={`${hideHeader ? '' : 'min-h-screen'} bg-gradient-to-br from-[#f0fbfc] via-white to-blue-50`}>
      {!hideHeader && <Header />}
      <div className="py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-b from-[#1A97A9] to-[#153c43] px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Rentit Cameras</h1>
              </div>
              <p className="text-white/90 text-xs sm:text-sm">Client Identity Verification Portal</p>
            </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="bg-[#f0fbfc] border border-[#1A97A9]/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A97A9] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-[#153c43] font-medium mb-1">
                  Official Government Portal Verification
                </p>
                <p className="text-xs text-[#1A97A9] leading-relaxed">
                  Verification is performed only on official government portals.
                  Rentit Cameras does not store Aadhaar or ID information.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="clientName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base ${
                    errors.clientName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent transition`}
                  placeholder="Enter full name as per ID"
                />
                {errors.clientName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.clientName}</p>
                )}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent transition`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="idType" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Government ID Type *
                </label>
                <select
                  id="idType"
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base ${
                    errors.idType ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent transition bg-white`}
                >
                  <option value="">Select ID type</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="voterId">Voter ID Card</option>
                  <option value="drivingLicence">Driving Licence</option>
                  <option value="rationCard">Ration Card</option>
                  <option value="panCard">PAN Card</option>
                  <option value="vehicleRegistration">Vehicle Registration</option>
                </select>
                {errors.idType && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.idType}</p>
                )}
              </div>

              <div>
                <label htmlFor="idNumber" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  ID Number (Reference Only) *
                </label>
                <input
                  type="text"
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-sm sm:text-base ${
                    errors.idNumber ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent transition`}
                  placeholder="Enter ID number for reference"
                />
                {errors.idNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.idNumber}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This number is for staff reference only and will not be stored
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1A97A9] hover:bg-[#153c43] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:ring-offset-2 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Open Verification Portal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:ring-offset-2 transition text-sm sm:text-base"
                >
                  Reset
                </button>
              </div>
            </form>

            {showIframe && (
              <div className="mt-4 sm:mt-8">
                <div className="bg-gradient-to-b from-[#1A97A9] to-[#153c43] px-3 sm:px-4 py-2.5 sm:py-3 rounded-t-lg flex items-center justify-between">
                  <h3 className="text-white font-semibold text-xs sm:text-sm truncate pr-2">
                    {formData.idType === 'aadhaar' && 'Aadhaar Verification'}
                    {formData.idType === 'voterId' && 'Voter ID Verification'}
                    {formData.idType === 'drivingLicence' && 'Driving Licence Verification'}
                    {formData.idType === 'rationCard' && 'Ration Card Verification'}
                    {formData.idType === 'panCard' && 'PAN Card Verification'}
                    {formData.idType === 'vehicleRegistration' && 'Vehicle Registration Verification'}
                  </h3>
                  <button
                    onClick={handleCloseIframe}
                    className="text-white hover:bg-[#1A97A9]/50 p-1 rounded transition flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-300 border-t-0 rounded-b-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-gray-600 whitespace-nowrap">Client:</span>
                      <span className="text-xs font-semibold text-gray-800 truncate">{formData.clientName}</span>
                      <button
                        onClick={() => handleCopy(formData.clientName, 'name')}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Copy client name"
                        aria-label="Copy client name"
                      >
                        {copiedField === 'name' ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#1A97A9] hover:text-[#153c43]" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-gray-600 whitespace-nowrap">ID Number:</span>
                      <span className="text-xs font-semibold text-gray-800 truncate">{formData.idNumber}</span>
                      <button
                        onClick={() => handleCopy(formData.idNumber, 'id')}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Copy ID number"
                        aria-label="Copy ID number"
                      >
                        {copiedField === 'id' ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#1A97A9] hover:text-[#153c43]" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-gray-300">
                    <iframe
                      src={ID_VERIFICATION_URLS[formData.idType]}
                      className="w-full h-64 sm:h-80 md:h-96 border-0"
                      title="Verification Portal"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
                    />
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleSaveRecord}
                      disabled={isSaving}
                      className="flex-1 bg-green-600 text-white py-2 sm:py-2.5 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSaving ? 'Saving...' : 'Save Record'}
                    </button>
                    <button
                      onClick={handleCloseIframe}
                      className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
                    >
                      Close
                    </button>
                  </div>

                  {saveMessage && (
                    <div
                      className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg flex gap-2 ${
                        saveMessage.type === 'success'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                          saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}
                      />
                      <p
                        className={`text-xs sm:text-sm ${
                          saveMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {saveMessage.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Supported Verification Portals:</h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-gray-600">
                <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                  <span className="font-medium w-full sm:w-36 flex-shrink-0">Aadhaar:</span>
                  <span className="break-all text-gray-600">myaadhaar.uidai.gov.in</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                  <span className="font-medium w-full sm:w-36 flex-shrink-0">Voter ID:</span>
                  <span className="break-all text-gray-600">electoralsearch.eci.gov.in</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                  <span className="font-medium w-full sm:w-36 flex-shrink-0">Driving Licence:</span>
                  <span className="break-all text-gray-600">parivahan.gov.in</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                  <span className="font-medium w-full sm:w-36 flex-shrink-0">Ration Card:</span>
                  <span className="break-all text-gray-600">nfsa.bih.nic.in</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                  <span className="font-medium w-full sm:w-36 flex-shrink-0">PAN Card:</span>
                  <span className="break-all text-gray-600">incometaxindiaefiling.gov.in</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                  <span className="font-medium w-full sm:w-36 flex-shrink-0">Vehicle Reg:</span>
                  <span className="break-all text-gray-600">vahan.nic.in</span>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 px-4">
            <p>© 2024 Rentit Cameras. Secure & Compliant Verification System</p>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
}

