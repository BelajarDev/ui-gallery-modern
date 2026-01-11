// ===== DOM ELEMENTS =====
const themeToggleBtn = document.getElementById("themeToggle");
const backToTopBtn = document.getElementById("backToTop");
const copyToast = document.getElementById("copyToast");
const searchInput = document.getElementById("search");
const filterTags = document.querySelectorAll(".filter-tag");
const components = document.querySelectorAll(".component");
const copyBtns = document.querySelectorAll(".copy-btn");
const expandBtns = document.querySelectorAll(".expand-btn");
const codeTabs = document.querySelectorAll(".code-tab");
const openModalBtns = document.querySelectorAll(".open-modal-btn");
const closeModalBtns = document.querySelectorAll(".modal-close");
const modals = document.querySelectorAll(".modal");
const formDemo = document.getElementById("demo-form");
const alertCloseBtns = document.querySelectorAll(".alert-close");

// ===== THEME TOGGLE =====
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeToggle(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
  const icon = themeToggleBtn.querySelector("i");
  const text = themeToggleBtn.querySelector("span");

  if (theme === "dark") {
    icon.className = "fas fa-sun";
    text.textContent = "Light";
  } else {
    icon.className = "fas fa-moon";
    text.textContent = "Dark";
  }
}

// ===== BACK TO TOP =====
function handleScroll() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = "success") {
  // Update toast content
  const icon = copyToast.querySelector("i");
  const text = copyToast.querySelector("span");

  if (type === "success") {
    icon.className = "fas fa-check-circle";
    copyToast.style.backgroundColor = "var(--success)";
  } else if (type === "error") {
    icon.className = "fas fa-times-circle";
    copyToast.style.backgroundColor = "var(--error)";
  }

  text.textContent = message;
  copyToast.classList.add("visible");

  // Hide toast after 3 seconds
  setTimeout(() => {
    copyToast.classList.remove("visible");
  }, 3000);
}

// ===== COMPONENT FILTERING =====
function filterComponents(filter) {
  components.forEach((component) => {
    if (filter === "all" || component.dataset.type === filter) {
      component.style.display = "block";
      setTimeout(() => {
        component.style.opacity = "1";
        component.style.transform = "translateY(0)";
      }, 10);
    } else {
      component.style.opacity = "0";
      component.style.transform = "translateY(20px)";
      setTimeout(() => {
        component.style.display = "none";
      }, 300);
    }
  });
}

// ===== CODE BLOCK FUNCTIONALITY =====
function copyCode(targetId) {
  const codeContainer = document.getElementById(targetId);
  const activeCodeBlock = codeContainer.querySelector(".code-block.active");
  const code = activeCodeBlock.querySelector("code").textContent;

  navigator.clipboard
    .writeText(code)
    .then(() => {
      showToast("Code copied to clipboard!", "success");
    })
    .catch((err) => {
      console.error("Failed to copy code: ", err);
      showToast("Failed to copy code", "error");
    });
}

function toggleCodeContainer(targetId) {
  const codeContainer = document.getElementById(targetId);
  const isCollapsed = codeContainer.classList.contains("collapsed");

  if (isCollapsed) {
    codeContainer.classList.remove("collapsed");
    codeContainer.style.maxHeight = codeContainer.scrollHeight + "px";
  } else {
    codeContainer.classList.add("collapsed");
    codeContainer.style.maxHeight = "0";
  }
}

// ===== MODAL FUNCTIONALITY =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function closeAllModals() {
  modals.forEach((modal) => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = "auto";
}

// ===== FORM VALIDATION =====
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "var(--error)";
      isValid = false;
    } else {
      input.style.borderColor = "var(--border)";
    }
  });

  if (isValid) {
    showToast("Form submitted successfully!", "success");
    form.reset();
  } else {
    showToast("Please fill in all required fields", "error");
  }

  return false; // Prevent actual form submission for demo
}

// ===== SEARCH FUNCTIONALITY =====
function searchComponents(query) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    // Show all components if search is empty
    filterComponents("all");
    filterTags.forEach((tag) => {
      tag.classList.remove("active");
      if (tag.dataset.filter === "all") {
        tag.classList.add("active");
      }
    });
    return;
  }

  components.forEach((component) => {
    const componentType = component.dataset.type;
    const componentTitle = component
      .querySelector("h2")
      .textContent.toLowerCase();
    const componentDesc = component
      .querySelector(".component-description")
      .textContent.toLowerCase();

    if (
      componentTitle.includes(normalizedQuery) ||
      componentDesc.includes(normalizedQuery) ||
      componentType.includes(normalizedQuery)
    ) {
      component.style.display = "block";
      setTimeout(() => {
        component.style.opacity = "1";
        component.style.transform = "translateY(0)";
      }, 10);
    } else {
      component.style.opacity = "0";
      component.style.transform = "translateY(20px)";
      setTimeout(() => {
        component.style.display = "none";
      }, 300);
    }
  });
}

// ===== INITIALIZATION =====
function initApp() {
  // Initialize theme
  initTheme();

  // Set up event listeners
  themeToggleBtn.addEventListener("click", toggleTheme);
  window.addEventListener("scroll", handleScroll);
  backToTopBtn.addEventListener("click", scrollToTop);

  // Filter functionality
  filterTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const filter = tag.dataset.filter;

      // Update active tag
      filterTags.forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");

      // Filter components
      filterComponents(filter);
    });
  });

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    searchComponents(e.target.value);
  });

  // Code block functionality
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.target;
      copyCode(targetId);
    });
  });

  expandBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.target;
      toggleCodeContainer(targetId);
    });
  });

  // Code tabs functionality
  codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabType = tab.dataset.tab;
      const codeContainer = tab.closest(".code-container");
      const codeBlocks = codeContainer.querySelectorAll(".code-block");

      // Update active tab
      codeContainer
        .querySelectorAll(".code-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Show corresponding code block
      codeBlocks.forEach((block) => {
        block.classList.remove("active");
        if (block.classList.contains(`${tabType}-code`)) {
          block.classList.add("active");
        }
      });
    });
  });

  // Modal functionality
  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      openModal(modalId);
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modal = btn.closest(".modal");
      closeModal(modal);
    });
  });

  // Close modal when clicking on overlay
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        closeModal(modal);
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Form submission
  if (formDemo) {
    formDemo.addEventListener("submit", (e) => {
      e.preventDefault();
      validateForm(formDemo);
    });
  }

  // Alert close buttons
  alertCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const alert = btn.closest(".alert");
      alert.style.opacity = "0";
      alert.style.transform = "translateX(-10px)";
      setTimeout(() => {
        alert.style.display = "none";
      }, 300);
    });
  });

  // Add animation to components on page load
  setTimeout(() => {
    components.forEach((component, index) => {
      setTimeout(() => {
        component.style.opacity = "1";
        component.style.transform = "translateY(0)";
      }, index * 100);
    });
  }, 300);

  // Initialize components with hidden state for animation
  components.forEach((component) => {
    component.style.opacity = "0";
    component.style.transform = "translateY(20px)";
    component.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  });

  // Initialize button hover effects
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// ===== DOCUMENT READY =====
document.addEventListener("DOMContentLoaded", initApp);

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
