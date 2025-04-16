'use strict';

// Navbar Toggle
const navbarNav = document.querySelector('.navbar-nav');
const navbarToggleBtn = document.querySelector('.nav-toggle-btn');
const submenu = document.querySelector('#submenu');

navbarToggleBtn.addEventListener('click', function () {
  navbarNav.classList.toggle('active');
  this.classList.toggle('active');
  
  // Close submenu when toggling main menu
  if (submenu) {
    const megaMenu = submenu.querySelector('.mega_menu');
    if (megaMenu) {
      megaMenu.style.visibility = 'hidden';
    }
  }
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
  if (!navbarNav.contains(e.target) && !navbarToggleBtn.contains(e.target) && navbarNav.classList.contains('active')) {
    navbarNav.classList.remove('active');
    navbarToggleBtn.classList.remove('active');
  }
});

// Handle submenu toggle on mobile
if (submenu) {
  submenu.addEventListener('click', function(e) {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      const megaMenu = this.querySelector('.mega_menu');
      if (megaMenu) {
        if (megaMenu.style.visibility === 'visible') {
          megaMenu.style.visibility = 'hidden';
        } else {
          megaMenu.style.visibility = 'visible';
        }
      }
    }
  });
}

// FAQ Toggle
document.querySelectorAll('.faq').forEach(faq => {
  faq.addEventListener('click', () => {
    faq.classList.toggle('open');

    // Change icon
    const icon = faq.querySelector('.faq_icon i');
    icon.classList.toggle('uil-minus');
    icon.classList.toggle('uil-plus');
  });
});

// Animation on Scroll
const boxes = document.querySelectorAll('.box');
window.addEventListener('scroll', checkBoxes);
checkBoxes();

function checkBoxes() {
  const triggerBottom = window.innerHeight * 0.7;
  boxes.forEach(box => {
    box.classList.toggle('show', box.getBoundingClientRect().top < triggerBottom);
  });
}

// Contact Form Toggle
const enquireForm = document.querySelector('.enquire');
document.querySelector('.btn-text')?.addEventListener('click', () => enquireForm.classList.add('revel'));
document.querySelector('.cross')?.addEventListener('click', () => enquireForm.classList.remove('revel'));

// Student Registration Button
document.addEventListener('DOMContentLoaded', function() {
  // Desktop student registration button
  const regsBtn = document.getElementById('regs');
  if (regsBtn) {
    regsBtn.addEventListener('click', function() {
      enquireForm.classList.add('revel');
    });
  }
  
  // Mobile student registration button
  const regsBtnMobile = document.getElementById('regs-mobile');
  if (regsBtnMobile) {
    regsBtnMobile.addEventListener('click', function() {
      enquireForm.classList.add('revel');
    });
  }
});

// Dropdown (Subjects Selection)
document.addEventListener('DOMContentLoaded', function () {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const checkboxes = document.querySelectorAll('.dropdown-options input[type="checkbox"]');
  const selectedItemsContainer = document.querySelector('.selected-items');
  const searchInput = document.querySelector('.search-input');

  dropdownToggle.addEventListener('click', function () {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    dropdownToggle.parentElement.classList.toggle('active');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      dropdownMenu.style.display = 'none';
      dropdownToggle.parentElement.classList.remove('active');
    }
  });

  checkboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedItems));

  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll('.dropdown-options label').forEach(option => {
      option.style.display = option.textContent.toLowerCase().includes(searchTerm) ? 'block' : 'none';
    });
  });

  function updateSelectedItems() {
    selectedItemsContainer.innerHTML = '';
    const selectedItems = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    selectedItems.forEach(item => {
      const selectedItemElement = document.createElement('div');
      selectedItemElement.className = 'selected-item';
      selectedItemElement.innerHTML = `${item} <span class="remove-btn" data-value="${item}">✕</span>`;
      selectedItemsContainer.appendChild(selectedItemElement);
    });

    dropdownToggle.textContent = selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select Subjects';

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelector(`.dropdown-options input[value="${this.getAttribute('data-value')}"]`).checked = false;
        updateSelectedItems();
      });
    });
  }
});

// Form Validation & Submission to Backend
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.fsum');
  const errorDiv = document.getElementById('form-error');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.querySelector('input[placeholder="Enter Your First Name"]').value.trim();
    const lastName = document.querySelector('input[placeholder="Enter Your Last Name"]').value.trim();
    const contact = document.querySelector('input[placeholder="Enter Your Contact"]').value.trim();
    const email = document.querySelector('input[placeholder="Enter Your Email"]').value.trim();
    const locality = document.querySelector('input[placeholder="Enter Your Locality"]').value.trim();
    const query = document.querySelector('textarea[placeholder="Enter your query or requirements"]').value.trim();
    const studentClass = document.getElementById('studentClass').value;
    if (!studentClass || studentClass === "") emptyFields.push("Class");
    const subjectElements = document.querySelectorAll('.dropdown-options input:checked');
    const subjects = Array.from(subjectElements).map(el => el.value);

    let emptyFields = [];
    if (!firstName) emptyFields.push("First Name");
    if (!lastName) emptyFields.push("Last Name");
    if (!contact) emptyFields.push("Contact");
    if (!locality) emptyFields.push("Locality");
    if (!studentClass || studentClass === "") emptyFields.push("Class"); // Better check
    if (subjects.length === 0) emptyFields.push("Subjects");

    if (emptyFields.length > 0) {
      errorDiv.textContent = `Please fill in the required fields: ${emptyFields.join(', ')}`;
      errorDiv.style.display = 'block';
      
      // Scroll to error message
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    errorDiv.style.display = 'none';

    try {
      const response = await fetch("https://omdayalhometuition.com/api/students/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, contact, email, locality, query, studentClass, subjects }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Form submitted successfully!");
        form.reset();
        
        // Reset class selection to default
        document.querySelector('select').selectedIndex = 0;
        
        // Reset selected subjects display
        const selectedItemsContainer = document.querySelector('.selected-items');
        if (selectedItemsContainer) selectedItemsContainer.innerHTML = '';
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        if (dropdownToggle) dropdownToggle.textContent = 'Select Subjects';
        
        // Uncheck all subject checkboxes
        document.querySelectorAll('.dropdown-options input:checked').forEach(checkbox => {
          checkbox.checked = false;
        });
      } else {
        errorDiv.textContent = result.message || "Submission failed. Try again.";
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      console.error("Error:", error);
      errorDiv.textContent = "Error submitting the form. Please try again later.";
      errorDiv.style.display = 'block';
    }
  });
});