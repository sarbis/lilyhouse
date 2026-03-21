// Lilyhouse Jewelry - Main JavaScript

// Global variables
let allItems = [];
let translations = {};
let currentLang = getLanguageFromURL() || localStorage.getItem('language') || 'lv';
let selectedColorOption = null;
let selectedMaterialOption = null;

// Get language from URL parameter
function getLanguageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam && (langParam === 'en' || langParam === 'lv')) {
    return langParam;
  }
  return null;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
  await initLanguage();
  await initMobileMenu();
  await loadItems(); // Wait for items to load
  await initModals();
  
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
    
    // Save the current language to localStorage for future visits
    localStorage.setItem('language', currentLang);
    
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
  
  // Update URL parameter without reloading the page
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
  
  updateLanguage(lang);
  updateActiveLangButton();
  
  // Re-render content based on current page
  const currentPage = getCurrentPage();
  if (currentPage === 'collection' && allItems.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const filteredItems = category === 'all' ? allItems : allItems.filter(item => item.category === category);
    renderCollection(document.getElementById('collection-items'), filteredItems);
  } else if (currentPage === 'item' && allItems.length > 0) {
    // Re-render item detail page
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      renderItemDetail(item);
    }
  }
  // else if (currentPage === 'index' && allItems.length > 0) {
  //   // Re-render featured items on home page
  //   const featuredContainer = document.getElementById('featured-items');
  //   if (featuredContainer) {
  //     renderFeaturedItems(featuredContainer);
  //   }
  // }
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

// Helper function to get translated item properties
function getItemTranslation(itemId, property) {
  return t(`items.${itemId}.${property}`) || '';
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
  // const featuredContainer = document.getElementById('featured-items');
  // if (featuredContainer && allItems.length > 0) {
  //   renderFeaturedItems(featuredContainer);
  // }
}

// Render featured items on home page
function renderFeaturedItems(container) {
  const featuredItems = allItems.filter(item => item.featured);
  const itemsToShow = featuredItems.slice(0, 1);
  
  container.innerHTML = itemsToShow.map(item => createProductCard(item)).join('');
  
  // Add click handlers
  addProductCardHandlers(container);
  
  // Update translations for dynamically added content
  updateLanguage(currentLang);
}

// Initialize collection page
function initCollectionPage() {
  const collectionContainer = document.getElementById('collection-items');
  
  // Get category from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') || 'all';
  
  if (collectionContainer && allItems.length > 0) {
    // Filter items based on URL parameter
    const filteredItems = categoryParam === 'all' 
      ? allItems 
      : allItems.filter(item => item.category === categoryParam);
    
    renderCollection(collectionContainer, filteredItems);
  }
  
  // Initialize category filter if it exists
  initCategoryFilter(categoryParam);
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
  const name = getItemTranslation(item.id, 'name');
  const description = getItemTranslation(item.id, 'description');
  const categoryName = t(`collection.filter_${item.category}`);
  
  const imageHtml = item.image 
    ? `<img src="${item.image}" alt="${name}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>♦</div>'">` 
    : '<div class="product-image-placeholder">♦</div>';
  
  return `
    <div class="product-card" data-item-id="${item.id}">
      <div class="product-image">
        ${imageHtml}
      </div>
      <div class="product-info">
        <div class="product-category">${categoryName}</div>
        <h3 class="product-name">${name}</h3>
        <p class="product-description">${description}</p>
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
function initCategoryFilter(initialCategory = 'all') {
  const filterBtnNodeList = document.querySelectorAll('.filter-btn');
  const collectionContainer = document.getElementById('collection-items');
  
  if (filterBtnNodeList.length === 0) return;

  // Remove any blank/empty category buttons
  const filterBtns = Array.from(filterBtnNodeList).filter(btn => {
    const category = btn.dataset.category?.trim();
    const text = btn.textContent?.trim();

    if (!category || category === '') {
      btn.remove();
      return false;
    }

    if (!text || text === '') {
      btn.remove();
      return false;
    }

    return true;
  });

  if (filterBtns.length === 0) return;
  
  // Set active button based on URL parameter
  filterBtns.forEach(btn => {
    if (btn.dataset.category === initialCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
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
      
      // Update URL parameter
      const url = new URL(window.location);
      if (category === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', category);
      }
      window.history.pushState({}, '', url);
      
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
  const name = getItemTranslation(item.id, 'name');
  const description = getItemTranslation(item.id, 'description');
  const longDescription = getItemTranslation(item.id, 'longDescription');
  const categoryName = t(`collection.filter_${item.category}`);

  const colorOptions = item.colorOptions || [];
  const materialOptions = item.materialOptions || [];
  let colorOptionsHtml = '';
  let materialOptionsHtml = '';

  if (colorOptions.length > 0) {
    selectedColorOption = colorOptions.find(c => c.value === selectedColorOption?.value) || colorOptions[0];
    const selectedColorLabel = selectedColorOption.name;
    colorOptionsHtml = `
      <div class="item-color-options">
        <div class="color-options-label">${t('item.color_options') || 'Color options'}</div>
        <div class="color-options-list">
          ${colorOptions.map(option => `
            <button
              type="button"
              class="color-circle ${selectedColorOption.value === option.value ? 'selected' : ''}"
              data-color="${option.value}"
              data-color-label="${option.name}"
              aria-label="${option.name}"
              style="background-color: ${option.value};"
            ></button>
          `).join('')}
        </div>
        <div class="selected-color-name" id="selectedColorName">${t('item.selected_color_prefix') || 'Selected color:'} ${selectedColorLabel}</div>
      </div>
    `;
  }

  if (materialOptions.length > 0) {
    selectedMaterialOption = materialOptions.find(m => m.value === selectedMaterialOption?.value) || materialOptions[0];
    const selectedMaterialLabel = selectedMaterialOption.name;
    console.log('renderItemDetail materialOptions', item.id, materialOptions);
    materialOptionsHtml = `
      <div class="item-material-options item-color-options">
        <div class="color-options-label">${t('item.material_options') || 'Material options'}</div>
        <div class="color-options-list">
          ${materialOptions.map(option => `
            <button
              type="button"
              class="color-circle material-circle ${selectedMaterialOption.value === option.value ? 'selected' : ''}"
              data-material="${option.value}"
              data-material-label="${option.name}"
              aria-label="${option.name}"
              style="background-color: ${option.value}; border-color: #333;"
            ></button>
          `).join('')}
        </div>
        <div class="selected-color-name" id="selectedMaterialName">${t('item.selected_material_prefix') || 'Selected material:'} ${selectedMaterialLabel}</div>
      </div>
    `;
  }
  
  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const mainImageHtml = images[0] 
    ? `<img src="${images[0]}" alt="${name}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>♦</div>'">` 
    : '<div class="product-image-placeholder">♦</div>';
  
  const thumbnailsHtml = images.length > 1 
    ? `<div class="thumbnail-images">
        ${images.map((img, index) => `
          <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
            <img src="${img}" alt="${name}" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder\\'>♦</div>'">
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
        <div class="item-category">${categoryName}</div>
        <h1>${name}</h1>
        ${item.price ? `<div class="item-price">${item.price}</div>` : ''}
        <div class="item-description">
          <p>${longDescription || description}</p>
        </div>
        ${colorOptionsHtml}
        ${materialOptionsHtml}
        <button class="btn" onclick="openReservationModal('${item.id}', '${name}')">${t('item.reserve')}</button>
        <div class="mt-2">
          <a href="collection.html" class="btn btn-secondary">← ${t('item.back_to_collection')}</a>
        </div>
      </div>
    </div>
  `;
  
  // Initialize color selection for this item (if available)
  if (colorOptions.length > 0) {
    initColorOptions();
  }

  // Initialize material selection for this item (if available)
  if (materialOptions.length > 0) {
    initMaterialOptions();
  }

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

function initColorOptions() {
  const colorButtons = document.querySelectorAll('.color-circle[data-color]');
  const selectedColorName = document.getElementById('selectedColorName');

  if (!colorButtons.length) return;

  colorButtons.forEach(button => {
    button.addEventListener('click', function() {
      const color = this.dataset.color;
      const label = this.dataset.colorLabel;

      // Update selected class
      colorButtons.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');

      selectedColorOption = { name: label, value: color };

      if (selectedColorName) {
        selectedColorName.textContent = `${(t('item.selected_color_prefix') || 'Selected color:')} ${label}`;
      }

      const itemColorField = document.getElementById('itemColor');
      if (itemColorField) {
        itemColorField.value = color;
      }
    });
  });

  // Initialize hidden color field with selected color
  const itemColorField = document.getElementById('itemColor');
  if (itemColorField && selectedColorOption) {
    itemColorField.value = selectedColorOption.value;
  }
}

function initMaterialOptions() {
  const materialButtons = document.querySelectorAll('.item-material-options .color-circle[data-material]');
  const selectedMaterialName = document.getElementById('selectedMaterialName');

  if (!materialButtons.length) return;

  materialButtons.forEach(button => {
    button.addEventListener('click', function() {
      const material = this.dataset.material;
      const label = this.dataset.materialLabel;

      materialButtons.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');

      selectedMaterialOption = { name: label, value: material };

      if (selectedMaterialName) {
        selectedMaterialName.textContent = `${(t('item.selected_material_prefix') || 'Selected material:')} ${label}`;
      }

      const itemMaterialField = document.getElementById('itemMaterial');
      if (itemMaterialField) {
        itemMaterialField.value = label;
      }
    });
  });

  const itemMaterialField = document.getElementById('itemMaterial');
  if (itemMaterialField && selectedMaterialOption) {
    itemMaterialField.value = selectedMaterialOption.name;
  }
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
    const itemColorField = document.getElementById('itemColor');
    
    if (itemNameField) {
      itemNameField.value = itemName;
    }
    
    if (itemNameDisplay) {
      itemNameDisplay.textContent = itemName;
    }

    if (itemColorField && selectedColorOption) {
      itemColorField.value = selectedColorOption.value;
    }

    const itemMaterialField = document.getElementById('itemMaterial');
    if (itemMaterialField && selectedMaterialOption) {
      itemMaterialField.value = selectedMaterialOption.name;
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
