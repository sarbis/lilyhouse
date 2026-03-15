// Lilyhouse Jewelry - Main JavaScript

// Global variables
let allItems = [];
let translations = {};
let currentLang = localStorage.getItem('language') || 'en';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initLanguage();
  initMobileMenu();
  loadItems();
  initModals();
  
  // Check which page we're on and initialize accordingly
  const currentPage = getCurrentPage();
  
  if (currentPage === 'index') {
    initHomePage();
  } else if (currentPage === 'collection') {
    initCollectionPage();
  } else if (currentPage === 'item') {
    initItemPage();
  }
});

// Language functionality
async function initLanguage() {
  try {
    const response = await fetch('data/translations.json');
    translations = await response.json();
    updateLanguage(currentLang);
    initLanguageSwitcher();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.dataset.lang;
      switchLanguage(lang);
    });
  });
  
  // Update active button
  updateActiveLangButton();
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  updateLanguage(lang);
  updateActiveLangButton();
  
  // Reload collection if on collection page
  const currentPage = getCurrentPage();
  if (currentPage === 'collection' && allItems.length > 0) {
    const category = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const filteredItems = category === 'all' ? allItems : allItems.filter(item => item.category === category);
    renderCollection(document.getElementById('collection-items'), filteredItems);
  }
}

function updateActiveLangButton() {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  
  // Update all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.dataset.translate;
    const keys = key.split('.');
    let value = t;
    
    keys.forEach(k => {
      value = value?.[k];
    });
    
    if (value) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.placeholder !== undefined && element.dataset.translateAttr === 'placeholder') {
          element.placeholder = value;
        } else {
          element.value = value;
        }
      } else {
        element.innerHTML = value;
      }
    }
  });
}

function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  
  keys.forEach(k => {
    value = value?.[k];
  });
  
  return value || key;
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '');
  return page || 'index';
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });
    
    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });
  }
}

// Load items from JSON
async function loadItems() {
  try {
    const response = await fetch('data/items.json');
    const data = await response.json();
    allItems = data.items;
  } catch (error) {
    console.error('Error loading items:', error);
    allItems = [];
  }
}

// Initialize home page
function initHomePage() {
  const featuredContainer = document.getElementById('featured-items');
  if (featuredContainer && allItems.length > 0) {
    renderFeaturedItems(featuredContainer);
  }
}

// Render featured items on home page
function renderFeaturedItems(container) {
  const featuredItems = allItems.filter(item => item.featured);
  const itemsToShow = featuredItems.slice(0, 3);
  
  container.innerHTML = itemsToShow.map(item => createProductCard(item)).join('');
  
  // Add click handlers
  addProductCardHandlers(container);
  
  // Update translations for dynamically added content
  updateLanguage(currentLang);
}

// Initialize collection page
function initCollectionPage() {
  const collectionContainer = document.getElementById('collection-items');
  if (collectionContainer && allItems.length > 0) {
    renderCollection(collectionContainer, allItems);
  }
  
  // Initialize category filter if it exists
  initCategoryFilter();
}

// Render collection
function renderCollection(container, items) {
  if (items.length === 0) {
    container.innerHTML = '<p class="text-center">No items found.</p>';
    return;
  }
  
  container.innerHTML = items.map(item => createProductCard(item)).join('');
  
  // Add click handlers
  addProductCardHandlers(container);
  
  // Update translations for dynamically added content
  updateLanguage(currentLang);
}

// Create product card HTML
function createProductCard(item) {
  const imageHtml = item.image 
    ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>♦</div>'">` 
    : '<div class="product-image-placeholder">♦</div>';
  
  return `
    <div class="product-card" data-item-id="${item.id}">
      <div class="product-image">
        ${imageHtml}
      </div>
      <div class="product-info">
        <div class="product-category">${item.category}</div>
        <h3 class="product-name">${item.name}</h3>
        <p class="product-description">${item.description}</p>
        ${item.price ? `<div class="product-price">${item.price}</div>` : ''}
        <a href="item.html?id=${item.id}" class="btn btn-secondary" data-translate="home.view_details">View Details</a>
      </div>
    </div>
  `;
}

// Add click handlers to product cards
function addProductCardHandlers(container) {
  const cards = container.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't navigate if clicking the button
      if (e.target.classList.contains('btn')) {
        return;
      }
      const itemId = this.dataset.itemId;
      window.location.href = `item.html?id=${itemId}`;
    });
  });
}

// Initialize category filter
function initCategoryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const collectionContainer = document.getElementById('collection-items');
  
  if (filterBtns.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter items
      const category = this.dataset.category;
      const filteredItems = category === 'all' 
        ? allItems 
        : allItems.filter(item => item.category === category);
      
      renderCollection(collectionContainer, filteredItems);
    });
  });
}

// Initialize item detail page
function initItemPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  
  if (!itemId) {
    document.querySelector('.item-detail').innerHTML = '<div class="container text-center"><p>Item not found.</p></div>';
    return;
  }
  
  const item = allItems.find(i => i.id === itemId);
  
  if (!item) {
    document.querySelector('.item-detail').innerHTML = '<div class="container text-center"><p>Item not found.</p></div>';
    return;
  }
  
  renderItemDetail(item);
}

// Render item detail page
function renderItemDetail(item) {
  const container = document.querySelector('.item-detail .container');
  
  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const mainImageHtml = images[0] 
    ? `<img src="${images[0]}" alt="${item.name}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>♦</div>'">` 
    : '<div class="product-image-placeholder">♦</div>';
  
  const thumbnailsHtml = images.length > 1 
    ? `<div class="thumbnail-images">
        ${images.map((img, index) => `
          <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
            <img src="${img}" alt="${item.name}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>♦</div>'">
          </div>
        `).join('')}
      </div>` 
    : '';
  
  container.innerHTML = `
    <div class="item-content">
      <div class="item-gallery">
        <div class="main-image" id="mainImage">
          ${mainImageHtml}
        </div>
        ${thumbnailsHtml}
      </div>
      
      <div class="item-info-detail">
        <div class="item-category">${item.category}</div>
        <h1>${item.name}</h1>
        ${item.price ? `<div class="item-price">${item.price}</div>` : ''}
        <div class="item-description">
          <p>${item.longDescription || item.description}</p>
        </div>
        <button class="btn" onclick="openReservationModal('${item.id}', '${item.name}')">
          Reserve This Item
        </button>
        <div class="mt-2">
          <a href="collection.html" class="btn btn-secondary">← Back to Collection</a>
        </div>
      </div>
    </div>
  `;
  
  // Initialize image gallery
  if (images.length > 1) {
    initImageGallery();
  }
}

// Initialize image gallery (thumbnail clicks)
function initImageGallery() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainImage');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update main image
      const newImageSrc = this.dataset.image;
      const img = this.querySelector('img');
      if (img) {
        mainImage.innerHTML = `<img src="${newImageSrc}" alt="Product image">`;
      }
    });
  });
}

// Modal functionality
function initModals() {
  const modals = document.querySelectorAll('.modal');
  
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
      });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Close modals with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => modal.classList.remove('active'));
    }
  });
}

// Open reservation modal
function openReservationModal(itemId, itemName) {
  const modal = document.getElementById('reservationModal');
  if (modal) {
    const itemNameField = document.getElementById('itemName');
    const itemNameDisplay = document.getElementById('itemNameDisplay');
    
    if (itemNameField) {
      itemNameField.value = itemName;
    }
    
    if (itemNameDisplay) {
      itemNameDisplay.textContent = itemName;
    }
    
    modal.classList.add('active');
  }
}

// Handle form submissions (for Formspree or other services)
function initFormHandlers() {
  const forms = document.querySelectorAll('form[data-form-type]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // If using Formspree, the form will submit normally
      // You can add custom validation or success messages here
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }
    });
  });
}

// Initialize form handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initFormHandlers();
});
