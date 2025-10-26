import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../config/firebase';

const DocumentUpload = ({ data, updateData, onNext, onBack }) => {
  const [documents, setDocuments] = useState({
    idProof: null,
    incomeProof: null,
    addressProof: null,
    bankStatements: null,
    ...data
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const { currentUser } = useAuth();

  const validateFile = (file, type) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = {
      idProof: ['image/jpeg', 'image/png', 'application/pdf'],
      incomeProof: ['image/jpeg', 'image/png', 'application/pdf'],
      addressProof: ['image/jpeg', 'image/png', 'application/pdf'],
      bankStatements: ['application/pdf']
    };

    if (!file) {
      return 'File is required';
    }

    if (file.size > maxSize) {
      return 'File size should be less than 5MB';
    }

    if (!allowedTypes[type].includes(file.type)) {
      return `Only ${allowedTypes[type].join(', ')} files are allowed`;
    }

    return '';
  };

  const handleFileUpload = async (e, type) => {
    if (!currentUser) {
      setErrors(prev => ({ ...prev, [type]: 'You must be logged in to upload files' }));
      return;
    }

    const file = e.target.files[0];
    const error = validateFile(file, type);
    
    if (error) {
      setErrors(prev => ({ ...prev, [type]: error }));
      return;
    }

    setErrors(prev => ({ ...prev, [type]: '' }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result;
        const timestamp = Date.now();
        
        // Create a unique document reference with timestamp
        const documentRef = ref(database, `documents/${currentUser.uid}/${type}/${timestamp}`);
        
        // Prepare document data
        const documentData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64String,
          uploadedAt: timestamp,
          userId: currentUser.uid,
          documentType: type
        };

        try {
          // Check if user has permission to write
          const userRef = ref(database, `documents/${currentUser.uid}`);
          const snapshot = await get(userRef);
          
          if (!snapshot.exists()) {
            // Create user's document directory if it doesn't exist
            await set(userRef, { userId: currentUser.uid });
          }

          // Upload document data
          await set(documentRef, documentData);
          
          // Update local state
          const updatedDocument = {
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: timestamp,
            path: `documents/${currentUser.uid}/${type}/${timestamp}`
          };
          
          setDocuments(prev => ({
            ...prev,
            [type]: updatedDocument
          }));
          
          updateData({
            ...documents,
            [type]: updatedDocument
          });

          setUploadProgress(prev => ({ ...prev, [type]: 100 }));
        } catch (error) {
          console.error('Error uploading document:', error);
          let errorMessage = 'Failed to upload document';
          
          if (error.code === 'PERMISSION_DENIED') {
            errorMessage = 'You do not have permission to upload documents';
          }
          
          setErrors(prev => ({ ...prev, [type]: errorMessage }));
        }
      };

      reader.onerror = () => {
        setErrors(prev => ({ ...prev, [type]: 'Failed to read file' }));
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(prev => ({ ...prev, [type]: progress }));
        }
      };

    } catch (error) {
      console.error('Error starting upload:', error);
      setErrors(prev => ({ ...prev, [type]: 'Failed to start upload' }));
    }
  };

  const handleNext = () => {
    // Check if all required documents are uploaded
    const requiredDocuments = ['idProof', 'incomeProof', 'addressProof', 'bankStatements'];
    const missingDocuments = requiredDocuments.filter(type => !documents[type]);
    
    if (missingDocuments.length > 0) {
      setErrors(prev => ({
        ...prev,
        general: `Please upload all required documents: ${missingDocuments.join(', ')}`
      }));
      return;
    }

    // Check if there are any upload errors
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      setErrors(prev => ({
        ...prev,
        general: 'Please fix all errors before proceeding'
      }));
      return;
    }

    // Check if any uploads are in progress
    const uploadsInProgress = Object.values(uploadProgress).some(progress => progress > 0 && progress < 100);
    if (uploadsInProgress) {
      setErrors(prev => ({
        ...prev,
        general: 'Please wait for all uploads to complete'
      }));
      return;
    }

    // If all checks pass, proceed to next step
    onNext();
  };

  const renderFileStatus = (type) => {
    if (documents[type]) {
      return (
        <div className="file-status">
          <span className="file-icon">✓</span>
          <span className="file-name">{documents[type].name}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="document-upload">
      {errors.general && (
        <div className="alert alert-error mb-4">
          {errors.general}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">ID Proof</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileUpload(e, 'idProof')}
          className="file-input"
          id="idProof"
        />
        <label htmlFor="idProof" className="file-upload-btn">
          Upload ID Proof
        </label>
        {uploadProgress.idProof > 0 && uploadProgress.idProof < 100 && (
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress.idProof}%` }}
            />
          </div>
        )}
        {renderFileStatus('idProof')}
        {errors.idProof && <div className="alert alert-error">{errors.idProof}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Income Proof</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileUpload(e, 'incomeProof')}
          className="file-input"
          id="incomeProof"
        />
        <label htmlFor="incomeProof" className="file-upload-btn">
          Upload Income Proof
        </label>
        {uploadProgress.incomeProof > 0 && uploadProgress.incomeProof < 100 && (
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress.incomeProof}%` }}
            />
          </div>
        )}
        {renderFileStatus('incomeProof')}
        {errors.incomeProof && <div className="alert alert-error">{errors.incomeProof}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Address Proof</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileUpload(e, 'addressProof')}
          className="file-input"
          id="addressProof"
        />
        <label htmlFor="addressProof" className="file-upload-btn">
          Upload Address Proof
        </label>
        {uploadProgress.addressProof > 0 && uploadProgress.addressProof < 100 && (
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress.addressProof}%` }}
            />
          </div>
        )}
        {renderFileStatus('addressProof')}
        {errors.addressProof && <div className="alert alert-error">{errors.addressProof}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Bank Statements (Last 3 months)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileUpload(e, 'bankStatements')}
          className="file-input"
          id="bankStatements"
        />
        <label htmlFor="bankStatements" className="file-upload-btn">
          Upload Bank Statements
        </label>
        {uploadProgress.bankStatements > 0 && uploadProgress.bankStatements < 100 && (
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress.bankStatements}%` }}
            />
          </div>
        )}
        {renderFileStatus('bankStatements')}
        {errors.bankStatements && <div className="alert alert-error">{errors.bankStatements}</div>}
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onBack}
        >
          Back
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload; 