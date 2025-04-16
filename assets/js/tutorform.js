document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tutor popup functionality
    initTutorPopup();
    
    // Initialize file upload functionality
    setupFileUploads();
    
    // Initialize form validation
    setupFormValidation();
});

/**
 * Initialize the tutor popup functionality
 */
function initTutorPopup() {
    const tutorPopup = document.getElementById('tutorPopup');
    const popupClose = document.getElementById('popupClose');
    const openPopupBtn = document.getElementById('openTutorPopup');
    const openPopupBtnMobile = document.getElementById('openTutorPopup-mobile');
    
    if (!tutorPopup) return;
    
    // Function to open the popup
    function openPopup() {
        tutorPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }
    
    // Function to close the popup
    function closePopup() {
        tutorPopup.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Close popup when clicking the X button
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    // Close popup when clicking outside the content
    tutorPopup.addEventListener('click', function(e) {
        if (e.target === tutorPopup) {
            closePopup();
        }
    });
    
    // Open popup when desktop trigger button is clicked
    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', openPopup);
    }
    
    // Open popup when mobile trigger button is clicked
    if (openPopupBtnMobile) {
        openPopupBtnMobile.addEventListener('click', openPopup);
    }
    
    // Close popup when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && tutorPopup.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Form submission
    const tutorForm = document.getElementById('tutorForm');
    if (tutorForm) {
        tutorForm.addEventListener('submit', handleFormSubmission);
    }
}

/**
 * Set up file upload functionality
 */
function setupFileUploads() {
    setupFileUpload('qualification', 'qualificationFileName', 'qualificationError');
    setupFileUpload('aadhaarFront', 'aadhaarFrontFileName', 'aadhaarFrontError');
    setupFileUpload('aadhaarBack', 'aadhaarBackFileName', 'aadhaarBackError');
}

/**
 * Set up individual file upload
 */
function setupFileUpload(inputId, fileNameId, errorId) {
    const fileInput = document.getElementById(inputId);
    const fileName = document.getElementById(fileNameId);
    const error = document.getElementById(errorId);
    const uploadDiv = document.getElementById(inputId + 'Upload');
    
    if (!fileInput || !fileName || !error || !uploadDiv) return;
    
    const successIcon = uploadDiv.querySelector('.upload-success');
    const clickable = uploadDiv.querySelector('.click-to-upload') || uploadDiv.querySelector('.file-upload-content');
    
    // Remove any existing event listeners to prevent duplicates
    if (clickable) {
        const newClickable = clickable.cloneNode(true);
        clickable.parentNode.replaceChild(newClickable, clickable);
        
        newClickable.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                fileInput.click();
            }, 10);
        });
    }
    
    // Remove any existing event listeners on the file input
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);
    
    newFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            fileName.textContent = file.name;
            if (successIcon) successIcon.style.display = 'none';
            
            // Validate file
            const validTypes = ['application/pdf', 'application/msword', 
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                              'image/jpeg', 'image/png'];
            const maxSize = 1 * 1024 * 1024; // 1MB
            
            if (!validTypes.includes(file.type) || file.size > maxSize) {
                error.style.display = 'block';
                uploadDiv.style.borderColor = 'red';
                error.textContent = "Invalid file type or size exceeds 1MB!";
            } else {
                error.style.display = 'none';
                uploadDiv.style.borderColor = '#ddd';
            }
        } else {
            fileName.textContent = 'No file chosen';
            if (successIcon) successIcon.style.display = 'none';
        }
    });
}

/**
 * Set up form validation
 */
function setupFormValidation() {
    const tutorForm = document.getElementById('tutorForm');
    if (!tutorForm) return;
    
    // Add validation on input change
    const inputs = tutorForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

/**
 * Validate a single field
 */
function validateField(field) {
    const fieldId = field.id;
    const error = document.getElementById(fieldId + 'Error');
    
    if (!error) return;
    
    // Reset error
    error.style.display = 'none';
    field.style.borderColor = '#ddd';
    
    // Validate based on field type
    if (field.required && !field.value.trim()) {
        error.style.display = 'block';
        field.style.borderColor = 'red';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            error.style.display = 'block';
            field.style.borderColor = 'red';
            return false;
        }
    }
    
    // Phone validation
    if ((fieldId === 'whatsapp' || fieldId === 'contact') && field.value) {
        if (!/^[0-9]{10,15}$/.test(field.value)) {
            error.style.display = 'block';
            field.style.borderColor = 'red';
            return false;
        }
    }
    
    return true;
}

/**
 * Handle form submission
 */
function handleFormSubmission(e) {
    e.preventDefault();
        
        if (!validateForm()) return;
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            const formData = new FormData(form);
            
            // Show upload progress
            ['qualification', 'aadhaarFront', 'aadhaarBack'].forEach(id => {
                if (document.getElementById(id).files.length > 0) {
                    showUploadProgress(id);
                }
            });
            
            const xhr = new XMLHttpRequest();
            
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    updateAllProgressBars(percent);
                }
            };
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            alert("Submission successful!");
                            form.reset();
                            resetAllUploadStatuses();
                        closePopup(); // Close popup after successful submission
                        } else {
                            alert("Error: " + response.message);
                        }
                    } else {
                        alert("Submission failed. Please try again.");
                    }
                }
            };
            
            xhr.open("POST", "https://www.omdayalhometuition.com/api/tutors/submit");
            xhr.send(formData);
            
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
}

/**
 * Validate the entire form
 */
function validateForm() {
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error').forEach(el => {
        el.style.display = 'none';
    });
    
    // Validate required fields
    const requiredFields = [
        'name', 'email', 'whatsapp', 'contact', 'city', 
        'locality', 'address', 'pincode', 'age',
        'tutorType', 'classCategory', 'subjects', 'experience', 'fees'
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const error = document.getElementById(field + 'Error');
        
        if (!element?.value?.trim()) {
            if (error) error.style.display = 'block';
            if (element) element.style.borderColor = 'red';
            isValid = false;
        } else if (element) {
            element.style.borderColor = '#ddd';
        }
    });
    
    // Special validation for sex/gender (radio buttons)
const sexSelected = document.querySelector('input[name="sex"]:checked');
const sexError = document.getElementById('sexError');
if (!sexSelected) {
    sexError.style.display = 'block';
    document.getElementById('genderGroup').style.border = '1px solid red';
    isValid = false;
} else {
    sexError.style.display = 'none';
    document.getElementById('genderGroup').style.border = 'none';
}
    
    // Email validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        if (emailError) emailError.style.display = 'block';
        email.style.borderColor = 'red';
        isValid = false;
    } else if (email) {
        email.style.borderColor = '#ddd';
    }
    
    // Phone validation
    ['whatsapp', 'contact'].forEach(field => {
        const element = document.getElementById(field);
        const error = document.getElementById(field + 'Error');
        
        if (element && !/^[0-9]{10,15}$/.test(element.value)) {
            if (error) error.style.display = 'block';
            element.style.borderColor = 'red';
            isValid = false;
        } else if (element) {
            element.style.borderColor = '#ddd';
        }
    });
    
    // File upload validation
    ['qualification', 'aadhaarFront', 'aadhaarBack'].forEach(id => {
        const fileInput = document.getElementById(id);
        const error = document.getElementById(id + 'Error');
        const uploadDiv = document.getElementById(id + 'Upload');
        
        if (fileInput && error && uploadDiv) {
            if (fileInput.files.length === 0) {
                error.style.display = 'block';
                error.textContent = 'This file is required';
                uploadDiv.style.borderColor = 'red';
                isValid = false;
            } else {
                uploadDiv.style.borderColor = '#ddd';
            }
        }
    });
    
    return isValid;
}

/**
 * Show upload progress for a file
 */
function showUploadProgress(inputId) {
    const uploadDiv = document.getElementById(inputId + 'Upload');
    const progressContainer = uploadDiv?.querySelector('.progress-container');
    if (progressContainer) progressContainer.style.display = 'block';
}

/**
 * Update all progress bars
 */
function updateAllProgressBars(percent) {
    ['qualification', 'aadhaarFront', 'aadhaarBack'].forEach(id => {
        const progressBar = document.getElementById(id + 'Progress');
        if (progressBar) progressBar.style.width = percent + '%';
        
        if (percent >= 100) {
            const uploadDiv = document.getElementById(id + 'Upload');
            const progressContainer = uploadDiv?.querySelector('.progress-container');
            const successIcon = uploadDiv?.querySelector('.upload-success');
            
            setTimeout(() => {
                if (progressContainer) progressContainer.style.display = 'none';
                if (successIcon) successIcon.style.display = 'inline';
            }, 500);
        }
    });
}

/**
 * Reset all upload statuses
 */
function resetAllUploadStatuses() {
    ['qualification', 'aadhaarFront', 'aadhaarBack'].forEach(id => {
        const uploadDiv = document.getElementById(id + 'Upload');
        if (!uploadDiv) return;
        
        const progressContainer = uploadDiv.querySelector('.progress-container');
        const progressBar = uploadDiv.querySelector('.progress-bar');
        const successIcon = uploadDiv.querySelector('.upload-success');
        const fileName = document.getElementById(id + 'FileName');
        
        if (progressContainer) progressContainer.style.display = 'none';
        if (progressBar) progressBar.style.width = '0%';
        if (successIcon) successIcon.style.display = 'none';
        if (fileName) fileName.textContent = 'No file chosen';
    });
}

/**
 * Close the popup
 */
function closePopup() {
    const tutorPopup = document.getElementById('tutorPopup');
    if (tutorPopup) {
        tutorPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}
