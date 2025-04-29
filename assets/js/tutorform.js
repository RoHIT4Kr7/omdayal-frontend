document.addEventListener("DOMContentLoaded", function () {
  // Initialize the tutor popup functionality
  initTutorPopup();

  // Initialize file upload functionality
  setupFileUploads();

  // Initialize form validation
  setupFormValidation();

  // Set max date for date of birth input to today
  const ageInput = document.getElementById("age");
  if (ageInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const maxDate = `${year}-${month}-${day}`;
    ageInput.setAttribute("max", maxDate);
    console.log(`Set max date for age input to ${maxDate}`);
  }
});

/**
 * Initialize the tutor popup functionality
 */
function initTutorPopup() {
  const tutorPopup = document.getElementById("tutorPopup");
  const popupClose = document.getElementById("popupClose");
  const openPopupBtn = document.getElementById("openTutorPopup");
  const openPopupBtnMobile = document.getElementById("openTutorPopup-mobile");

  if (!tutorPopup) return;

  // Function to open the popup
  function openPopup() {
    tutorPopup.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when popup is open
  }

  // Function to close the popup
  function closePopup() {
    tutorPopup.classList.remove("active");
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }

  // Close popup when clicking the X button
  if (popupClose) {
    popupClose.addEventListener("click", closePopup);
  }

  // Close popup when clicking outside the content
  tutorPopup.addEventListener("click", function (e) {
    if (e.target === tutorPopup) {
      closePopup();
    }
  });

  // Open popup when desktop trigger button is clicked
  if (openPopupBtn) {
    openPopupBtn.addEventListener("click", openPopup);
  }

  // Open popup when mobile trigger button is clicked
  if (openPopupBtnMobile) {
    openPopupBtnMobile.addEventListener("click", openPopup);
  }

  // Close popup when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && tutorPopup.classList.contains("active")) {
      closePopup();
    }
  });

  // Form submission
  const tutorForm = document.getElementById("tutorForm");
  if (tutorForm) {
    tutorForm.addEventListener("submit", handleFormSubmission);
  }
}

/**
 * Set up file upload functionality
 */
function setupFileUploads() {
  // Check if file uploads are already set up to prevent duplicate setup
  if (
    document.getElementById("qualification")?.hasAttribute("data-initialized")
  ) {
    return;
  }

  setupFileUpload(
    "qualification",
    "qualificationFileName",
    "qualificationError"
  );
  setupFileUpload("aadhaarFront", "aadhaarFrontFileName", "aadhaarFrontError");
  setupFileUpload("aadhaarBack", "aadhaarBackFileName", "aadhaarBackError");

  // Mark file inputs as initialized
  ["qualification", "aadhaarFront", "aadhaarBack"].forEach((id) => {
    const fileInput = document.getElementById(id);
    if (fileInput) {
      fileInput.setAttribute("data-initialized", "true");
    }
  });
}

/**
 * Set up individual file upload
 */
function setupFileUpload(inputId, fileNameId, errorId) {
  const fileInput = document.getElementById(inputId);
  const fileName = document.getElementById(fileNameId);
  const error = document.getElementById(errorId);
  const uploadDiv = document.getElementById(inputId + "Upload");

  if (!fileInput || !fileName || !error || !uploadDiv) {
    return;
  }

  const successIcon = uploadDiv.querySelector(".upload-success");
  const clickable =
    uploadDiv.querySelector(".click-to-upload") ||
    uploadDiv.querySelector(".file-upload-content");

  // Remove any existing event listeners to prevent duplicates
  if (clickable) {
    const newClickable = clickable.cloneNode(true);
    clickable.parentNode.replaceChild(newClickable, clickable);

    newClickable.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        fileInput.click();
      }, 10);
    });
  }

  // Check if the file input already has a data-has-file attribute
  // This is important to preserve the state between form submissions
  if (fileInput.hasAttribute("data-has-file")) {
    if (successIcon) successIcon.style.display = "inline";
    error.style.display = "none";
    uploadDiv.style.borderColor = "#ddd";
  }

  // Set initial state based on whether a file is already selected
  if (fileInput.files.length > 0) {
    fileInput.setAttribute("data-has-file", "true");
    fileName.textContent = fileInput.files[0].name;
    if (successIcon) successIcon.style.display = "inline";
    error.style.display = "none";
    uploadDiv.style.borderColor = "#ddd";
  }

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const file = this.files[0];
      fileName.textContent = file.name;
      if (successIcon) successIcon.style.display = "none";

      // Validate file
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];
      const maxSize = 1 * 1024 * 1024; // 1MB

      if (!validTypes.includes(file.type) || file.size > maxSize) {
        error.style.display = "block";
        uploadDiv.style.borderColor = "red";
        error.textContent = "Invalid file type or size exceeds 1MB!";
        // Clear the data-has-file attribute
        this.removeAttribute("data-has-file");
      } else {
        error.style.display = "none";
        uploadDiv.style.borderColor = "#ddd";

        // Mark this field as having a file selected (for validation)
        this.setAttribute("data-has-file", "true");

        // Show success icon
        if (successIcon) successIcon.style.display = "inline";
      }
    } else {
      fileName.textContent = "No file chosen";
      if (successIcon) successIcon.style.display = "none";

      // Clear the data-has-file attribute
      this.removeAttribute("data-has-file");
    }
  });
}

/**
 * Set up form validation
 */
function setupFormValidation() {
  const tutorForm = document.getElementById("tutorForm");
  if (!tutorForm) return;

  // Add novalidate attribute to prevent browser's default validation
  tutorForm.setAttribute("novalidate", "");

  // Add event listeners for real-time validation
  const inputs = tutorForm.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });
}

function validateField(field) {
  const fieldId = field.id;
  const error = document.getElementById(fieldId + "Error");

  if (!error) return;

  // Reset error display
  error.style.display = "none";
  field.style.borderColor = "#ddd";

  // Validate based on field type
  if (field.required && !field.value.trim()) {
    error.style.display = "block";
    field.style.borderColor = "red";
    return false;
  }

  // Email validation
  if (fieldId === "email" && field.value.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      error.style.display = "block";
      field.style.borderColor = "red";
      return false;
    }
  }

  // Phone validation
  if ((fieldId === "whatsapp" || fieldId === "contact") && field.value.trim()) {
    if (!/^[0-9]{10,15}$/.test(field.value)) {
      error.style.display = "block";
      field.style.borderColor = "red";
      return false;
    }
  }

  // Age validation (must be at least 18 years old)
  if (fieldId === "age" && field.value) {
    const birthDate = new Date(field.value);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    console.log(`Age calculated: ${age} years`);

    if (age < 18) {
      error.textContent = "You must be at least 18 years old to register";
      error.style.display = "block";
      field.style.borderColor = "red";
      return false;
    }
  }

  return true;
}

/**
 * Check if a file is selected for a given input
 */
function isFileSelected(inputId) {
  const fileInput = document.getElementById(inputId);
  if (!fileInput) {
    return false;
  }

  // Check if there are files selected
  if (fileInput.files.length > 0) {
    return true;
  }

  // Check if the data-has-file attribute is set
  if (fileInput.hasAttribute("data-has-file")) {
    return true;
  }

  return false;
}

/**
 * Validate the entire form
 */
function validateForm() {
  let isValid = true;

  // Reset errors
  document.querySelectorAll(".error").forEach((el) => {
    el.style.display = "none";
  });

  // Validate required fields
  const requiredFields = [
    "name",
    "email",
    "whatsapp",
    "contact",
    "city",
    "locality",
    "address",
    "pincode",
    "age",
    "tutorType",
    "classCategory",
    "subjects",
    "experience",
    "fees",
  ];

  requiredFields.forEach((field) => {
    const element = document.getElementById(field);
    const error = document.getElementById(field + "Error");

    if (!element?.value?.trim()) {
      if (error) error.style.display = "block";
      if (element) element.style.borderColor = "red";
      isValid = false;
    } else if (element) {
      element.style.borderColor = "#ddd";
    }
  });

  // Special validation for sex/gender (radio buttons)
  const sexSelected = document.querySelector('input[name="sex"]:checked');
  const sexError = document.getElementById("sexError");
  if (!sexSelected) {
    sexError.style.display = "block";
    document.getElementById("genderGroup").style.border = "1px solid red";
    isValid = false;
  } else {
    sexError.style.display = "none";
    document.getElementById("genderGroup").style.border = "none";
  }

  // Email validation
  const email = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    if (emailError) emailError.style.display = "block";
    email.style.borderColor = "red";
    isValid = false;
  } else if (email) {
    email.style.borderColor = "#ddd";
  }

  // Phone validation
  ["whatsapp", "contact"].forEach((field) => {
    const element = document.getElementById(field);
    const error = document.getElementById(field + "Error");

    if (element && !/^[0-9]{10,15}$/.test(element.value)) {
      if (error) error.style.display = "block";
      element.style.borderColor = "red";
      isValid = false;
    } else if (element) {
      element.style.borderColor = "#ddd";
    }
  });

  // Age validation (must be at least 18 years old)
  const ageInput = document.getElementById("age");
  const ageError = document.getElementById("ageError");
  if (ageInput && ageInput.value) {
    const birthDate = new Date(ageInput.value);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      if (ageError) {
        ageError.textContent = "You must be at least 18 years old to register";
        ageError.style.display = "block";
      }
      ageInput.style.borderColor = "red";
      isValid = false;
    } else {
      if (ageError) ageError.style.display = "none";
      ageInput.style.borderColor = "#ddd";
    }
  }
  //validate pincode
  const pincode = document.getElementById("pincode");
  const pincodeError = document.getElementById("pincodeError");
  if (
    pincode &&
    pincode.value.trim() &&
    !/^[1-9][0-9]{5}$/.test(pincode.value.trim())
  ) {
    if (!pincodeError) {
      // Create error element if it doesn't exist
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.id = "pincodeError";
      errorDiv.textContent = "Please enter a valid 6-digit pincode";
      pincode.parentNode.insertBefore(errorDiv, pincode.nextSibling);
    } else {
      pincodeError.style.display = "block";
    }
    pincode.style.borderColor = "red";
    isValid = false;
  } else if (pincode) {
    pincode.style.borderColor = "#ddd";
    if (pincodeError) pincodeError.style.display = "none";
  }
  // File upload validation
  ["qualification", "aadhaarFront", "aadhaarBack"].forEach((id) => {
    const fileInput = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    const uploadDiv = document.getElementById(id + "Upload");

    if (fileInput && error && uploadDiv) {
      // Check if file is selected using our helper function
      if (!isFileSelected(id)) {
        error.style.display = "block";
        error.textContent = "This file is required";
        uploadDiv.style.borderColor = "red";
        isValid = false;
      } else {
        // File is selected, clear any error
        error.style.display = "none";
        uploadDiv.style.borderColor = "#ddd";
      }
    }
  });

  return isValid;
}

// Modified handleFormSubmission function
function handleFormSubmission(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const formData = new FormData(form);

    // Make sure the file inputs are included in the FormData
    const fileInputs = ["qualification", "aadhaarFront", "aadhaarBack"];
    fileInputs.forEach((id) => {
      const fileInput = document.getElementById(id);

      if (fileInput && fileInput.files.length > 0) {
        formData.set(id, fileInput.files[0]);
        showUploadProgress(id);
      }
    });

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        updateAllProgressBars(percent);
      }
    };

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              alert("Submission successful!");
              form.reset();
              resetAllUploadStatuses();
              closePopup(); // Close popup after successful submission
            } else {
              alert("Error: " + response.message);
            }
          } catch (e) {
            alert(
              "Submission received but response was not valid. Please check your form status."
            );
          }
        } else {
          alert("Submission failed. Please try again.");
        }
      }
    };

    xhr.open("POST", "https://api.omdayalhometuition.com/api/tutors/submit");
    xhr.send(formData);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

/**
 * Show upload progress for a file
 */
function showUploadProgress(inputId) {
  const uploadDiv = document.getElementById(inputId + "Upload");
  const progressContainer = uploadDiv?.querySelector(".progress-container");
  if (progressContainer) progressContainer.style.display = "block";
}

/**
 * Update all progress bars
 */
function updateAllProgressBars(percent) {
  ["qualification", "aadhaarFront", "aadhaarBack"].forEach((id) => {
    const progressBar = document.getElementById(id + "Progress");
    if (progressBar) progressBar.style.width = percent + "%";

    if (percent >= 100) {
      const uploadDiv = document.getElementById(id + "Upload");
      const progressContainer = uploadDiv?.querySelector(".progress-container");
      const successIcon = uploadDiv?.querySelector(".upload-success");

      setTimeout(() => {
        if (progressContainer) progressContainer.style.display = "none";
        if (successIcon) successIcon.style.display = "inline";
      }, 500);
    }
  });
}

/**
 * Reset all upload statuses
 */
function resetAllUploadStatuses() {
  ["qualification", "aadhaarFront", "aadhaarBack"].forEach((id) => {
    const uploadDiv = document.getElementById(id + "Upload");
    if (!uploadDiv) return;

    const progressContainer = uploadDiv.querySelector(".progress-container");
    const progressBar = uploadDiv.querySelector(".progress-bar");
    const successIcon = uploadDiv.querySelector(".upload-success");
    const fileName = document.getElementById(id + "FileName");

    if (progressContainer) progressContainer.style.display = "none";
    if (progressBar) progressBar.style.width = "0%";
    if (successIcon) successIcon.style.display = "none";
    if (fileName) fileName.textContent = "No file chosen";
  });
}

/**
 * Close the popup
 */
function closePopup() {
  const tutorPopup = document.getElementById("tutorPopup");
  if (tutorPopup) {
    tutorPopup.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// Terms and conditions checkbox validation
const termsRadios = document.getElementsByName("terms");
const termsError = document.getElementById("termsError");
let termsAccepted = false;

for (let i = 0; i < termsRadios.length; i++) {
  if (termsRadios[i].checked && termsRadios[i].value === "accept") {
    termsAccepted = true;
    break;
  }
}

if (!termsAccepted) {
  termsError.style.display = "block";
  termsError.textContent = "You must accept the terms and conditions to proceed";
  termsRadios[0].scrollIntoView({ behavior: "smooth", block: "center" });
  isValid = false;
} else {
  termsError.style.display = "none";
}

