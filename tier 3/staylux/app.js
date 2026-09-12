const defaultHotels = [
    {
        id: "stay-1",
        title: "Malibu Horizon Villa",
        category: "Villas",
        price: 950,
        beds: 5,
        rating: 4.98,
        reviews: 52,
        location: "Malibu, California",
        image: "images/hero-dusk.jpg",
        desc: "Floor-to-ceiling glass architecture with expansive ocean terraces, heated infinity pool, and personal chef quarters.",
        isDeal: true,
        discount: "20% OFF"
    },
    {
        id: "stay-2",
        title: "Alpine Timber Chalet",
        category: "Chalets",
        price: 720,
        beds: 4,
        rating: 4.92,
        reviews: 41,
        location: "Aspen, Colorado",
        image: "images/chalet-alpine.jpg",
        desc: "Ski-in ski-out modern timber sanctuary with outdoor cedar spa tub and panoramic mountain vistas.",
        isDeal: false
    },
    {
        id: "stay-3",
        title: "Blue Wave Oceanfront Resort",
        category: "Beachfront",
        price: 1150,
        beds: 6,
        rating: 5.0,
        reviews: 38,
        location: "Maui, Hawaii",
        image: "images/beach-resort.jpg",
        desc: "Direct private beach access, open-air living pavilions, tropical gardens, and full concierge staff.",
        isDeal: true,
        discount: "15% OFF"
    },
    {
        id: "stay-4",
        title: "Skyline Glass Penthouse",
        category: "Penthouses",
        price: 880,
        beds: 3,
        rating: 4.95,
        reviews: 64,
        location: "Tokyo, Japan",
        image: "images/penthouse-sky.jpg",
        desc: "360-degree city skyline panoramas, private rooftop plunge pool, and bespoke luxury interiors.",
        isDeal: false
    },
    {
        id: "stay-5",
        title: "Bali Bamboo Haven Sanctuary",
        category: "Resorts",
        price: 640,
        beds: 3,
        rating: 4.89,
        reviews: 29,
        location: "Ubud, Bali",
        image: "images/tropical-haven.jpg",
        desc: "Eco-lux bamboo architecture enveloped by lush jungle, yoga pavilion, and infinity waterfalls.",
        isDeal: true,
        discount: "25% OFF"
    },
    {
        id: "stay-6",
        title: "Lake Como Heritage Estate",
        category: "Villas",
        price: 1300,
        beds: 7,
        rating: 4.99,
        reviews: 47,
        location: "Lake Como, Italy",
        image: "images/lake-estate.jpg",
        desc: "Historic Italian lakefront villa with private boat dock, botanical gardens, and wine cellars.",
        isDeal: false
    }
];

const destinationsData = [
    { title: "Malibu, USA", count: "14 Properties", image: "images/dest-malibu.jpg" },
    { title: "Swiss Alps", count: "22 Chalets", image: "images/dest-alps.jpg" },
    { title: "Bali, Indonesia", count: "31 Sanctuaries", image: "images/dest-bali.jpg" },
    { title: "Tokyo, Japan", count: "18 Penthouses", image: "images/dest-tokyo.jpg" }
];

let state = {
    hotels: JSON.parse(localStorage.getItem('staylux_data')) || defaultHotels,
    currentView: 'home', // 'home' | 'deals' | 'destinations' | 'detail'
    activeCategory: 'All',
    searchQuery: '',
    selectedHotelId: null
};

document.addEventListener('DOMContentLoaded', () => {
    renderView();
    initScrollAnimations();
});

function navigateTo(viewName, param = null) {
    state.currentView = viewName;
    if (param) state.selectedHotelId = param;
    
    // Update active navbar links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${viewName}`);
    if (activeNav) activeNav.classList.add('active');

    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderView() {
    const container = document.getElementById('app-content');
    
    if (state.currentView === 'home') {
        container.innerHTML = renderHomeView();
    } else if (state.currentView === 'deals') {
        container.innerHTML = renderDealsView();
    } else if (state.currentView === 'destinations') {
        container.innerHTML = renderDestinationsView();
    } else if (state.currentView === 'detail') {
        container.innerHTML = renderDetailView();
    }
    
    initScrollAnimations();
}

function renderHomeView() {
    const filteredHotels = getFilteredHotels();
    const categories = ['All', 'Villas', 'Chalets', 'Beachfront', 'Penthouses', 'Resorts'];

    return `
        <!-- HERO SECTION MATCHING REFERENCE IMAGE BRANDED TO STAYLUX -->
        <section class="hero-wrapper">
            <div class="hero-watermark">StayLux</div>
            <div class="hero-card">
                <img src="images/hero-dusk.jpg" alt="StayLux Luxury House" class="hero-bg-img">
                <div class="hero-overlay">
                    <div class="hero-bottom-row">
                        <h1 class="hero-headline">Find Your Perfect Stay at the Best Price</h1>
                        
                        <!-- Floating Pill Search Bar -->
                        <div class="search-pill-container">
                            <i class="fa-solid fa-magnifying-glass" style="color: var(--text-muted);"></i>
                            <input type="text" id="hero-search-input" class="search-pill-input" placeholder="Search hotel or location..." value="${state.searchQuery}" oninput="handleSearchInput(event)">
                            <button class="btn btn-orange" onclick="filterHotels()">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FILTERABLE ITEM GRID -->
        <section class="section-container">
            <div class="section-header fade-up">
                <div>
                    <h2 class="section-title">Explore Curated Residences</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Filter through architecturally unique stays.</p>
                </div>

                <div class="category-pills">
                    ${categories.map(cat => `
                        <button onclick="setCategory('${cat}')" class="cat-pill ${state.activeCategory === cat ? 'active' : ''}">${cat}</button>
                    `).join('')}
                </div>
            </div>

            <div class="grid-container fade-up">
                ${filteredHotels.length > 0 ? filteredHotels.map(hotel => renderHotelCard(hotel)).join('') : '<p style="color: var(--text-muted); grid-column: 1/-1;">No residences found matching your criteria.</p>'}
            </div>
        </section>
    `;
}

function renderDealsView() {
    const dealHotels = state.hotels.filter(h => h.isDeal);

    return `
        <section class="section-container" style="padding-top: 120px;">
            <div class="section-header fade-up">
                <div>
                    <span class="modal-badge"><i class="fa-solid fa-tag"></i> EXCLUSIVE OFFERS</span>
                    <h1 class="section-title">Deals & Special Offers</h1>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Limited-time rates on high-end luxury stays.</p>
                </div>
            </div>

            <div class="grid-container fade-up">
                ${dealHotels.map(hotel => renderHotelCard(hotel)).join('')}
            </div>
        </section>
    `;
}

function renderDestinationsView() {
    return `
        <section class="section-container" style="padding-top: 120px;">
            <div class="section-header fade-up">
                <div>
                    <span class="modal-badge"><i class="fa-solid fa-earth-americas"></i> GLOBETROTTER DIRECTORY</span>
                    <h1 class="section-title">Popular Destinations</h1>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Select a region to browse available luxury properties.</p>
                </div>
            </div>

            <div class="destinations-grid fade-up">
                ${destinationsData.map(dest => `
                    <div class="dest-card" onclick="filterByDestination('${dest.title.split(',')[0]}')">
                        <img src="${dest.image}" alt="${dest.title}">
                        <div class="dest-overlay">
                            <span class="dest-count">${dest.count}</span>
                            <h3 class="dest-title">${dest.title}</h3>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderDetailView() {
    const hotel = state.hotels.find(h => h.id === state.selectedHotelId) || state.hotels[0];

    return `
        <div class="detail-container">
            <button class="btn btn-secondary" onclick="navigateTo('home')" style="margin-bottom: 1.5rem;">
                <i class="fa-solid fa-arrow-left"></i> Back to Explore
            </button>

            <div class="detail-header fade-up">
                <div>
                    <span class="modal-badge">${hotel.category} Collection</span>
                    <h1 class="detail-title">${hotel.title}</h1>
                    <p style="color: var(--text-muted); margin-top: 0.25rem;">
                        <i class="fa-solid fa-location-dot" style="color: var(--accent-orange);"></i> ${hotel.location} &bull; 
                        <i class="fa-solid fa-star" style="color: #fbbf24;"></i> ${hotel.rating} (${hotel.reviews} reviews)
                    </p>
                </div>
            </div>

            <div class="detail-gallery fade-up">
                <div class="detail-gallery-main">
                    <img src="${hotel.image}" alt="${hotel.title}">
                </div>
                <div class="detail-gallery-sub">
                    <img src="images/chalet-alpine.jpg" alt="Interior view">
                    <img src="images/penthouse-sky.jpg" alt="Terrace view">
                </div>
            </div>

            <div class="detail-layout">
                <div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">About This Residence</h3>
                    <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem;">${hotel.desc}</p>

                    <h4 style="font-size: 1.2rem; margin-bottom: 1rem;">Key Amenities</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                        <div><i class="fa-solid fa-water" style="color: var(--accent-orange);"></i> Infinity Edge Pool</div>
                        <div><i class="fa-solid fa-wifi" style="color: var(--accent-orange);"></i> High-Speed Starlink</div>
                        <div><i class="fa-solid fa-utensils" style="color: var(--accent-orange);"></i> Chef's Kitchen</div>
                        <div><i class="fa-solid fa-car" style="color: var(--accent-orange);"></i> Private Garage</div>
                    </div>
                </div>

                <div>
                    <div class="booking-card fade-up">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem;">
                            <div class="price-tag">$${hotel.price} <span>/ night</span></div>
                            <span class="card-rating"><i class="fa-solid fa-star"></i> ${hotel.rating}</span>
                        </div>

                        <div class="booking-field">
                            <label>Duration (Nights)</label>
                            <input type="number" id="detail-nights" value="3" min="1" max="30" oninput="updateBookingTotal(${hotel.price})">
                        </div>

                        <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-top: 1.5rem; margin-bottom: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                                <span>Subtotal</span>
                                <span id="calc-subtotal" style="color: #fff;">$${hotel.price * 3}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                                <span>Service & Host Fee</span>
                                <span style="color: #fff;">$120</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.2rem; color: #fff; margin-top: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
                                <span>Total Price</span>
                                <span id="calc-total" style="color: var(--accent-orange);">$${(hotel.price * 3) + 120}</span>
                            </div>
                        </div>

                        <button class="btn btn-orange btn-full" onclick="alert('Booking request sent for: ${hotel.title}')">Reserve Property</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderHotelCard(hotel) {
    return `
        <div class="hotel-card" onclick="navigateTo('detail', '${hotel.id}')">
            <div class="card-media">
                <img src="${hotel.image}" alt="${hotel.title}">
                <span class="card-badge">${hotel.category}</span>
            </div>
            <div class="card-body">
                <div>
                    <div class="card-meta-top">
                        <span><i class="fa-solid fa-location-dot" style="color: var(--accent-orange);"></i> ${hotel.location}</span>
                        <span class="card-rating"><i class="fa-solid fa-star"></i> ${hotel.rating}</span>
                    </div>
                    <h3 class="card-title">${hotel.title}</h3>
                    <p class="card-desc">${hotel.desc}</p>
                </div>
                <div class="card-price-row">
                    <div class="price-tag">$${hotel.price} <span>/ night</span></div>
                    <span style="color: var(--accent-orange); font-weight: 700; font-size: 0.85rem;">View Stay &gt;</span>
                </div>
            </div>
        </div>
    `;
}

function setCategory(cat) {
    state.activeCategory = cat;
    renderView();
}

function handleSearchInput(e) {
    state.searchQuery = e.target.value;
    filterHotels();
}

function filterHotels() {
    const container = document.querySelector('.grid-container');
    if (!container) return;
    const filtered = getFilteredHotels();
    container.innerHTML = filtered.length > 0 ? filtered.map(hotel => renderHotelCard(hotel)).join('') : '<p style="color: var(--text-muted); grid-column: 1/-1;">No residences found matching your search.</p>';
}

function filterByDestination(locationName) {
    state.searchQuery = locationName;
    navigateTo('home');
}

function getFilteredHotels() {
    return state.hotels.filter(hotel => {
        const matchCat = state.activeCategory === 'All' || hotel.category === state.activeCategory;
        const matchQuery = hotel.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                            hotel.location.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchCat && matchQuery;
    });
}

function updateBookingTotal(pricePerNight) {
    const nights = Math.max(1, parseInt(document.getElementById('detail-nights').value) || 1);
    const subtotal = pricePerNight * nights;
    document.getElementById('calc-subtotal').textContent = `$${subtotal}`;
    document.getElementById('calc-total').textContent = `$${subtotal + 120}`;
}

/* CMS MODAL LOGIC */
function openCmsPortal() {
    document.getElementById('cms-modal').classList.remove('hidden');
}

function closeCmsModal() {
    document.getElementById('cms-modal').classList.add('hidden');
}

function handleCmsSubmit(e) {
    e.preventDefault();
    const newHotel = {
        id: 'stay-' + Date.now(),
        title: document.getElementById('cms-title').value,
        category: document.getElementById('cms-category').value,
        price: parseFloat(document.getElementById('cms-price').value) || 500,
        beds: parseInt(document.getElementById('cms-beds').value) || 2,
        rating: 5.0,
        reviews: 1,
        location: document.getElementById('cms-location').value,
        image: document.getElementById('cms-image').value,
        desc: document.getElementById('cms-desc').value,
        isDeal: false
    };

    state.hotels.unshift(newHotel);
    localStorage.setItem('staylux_data', JSON.stringify(state.hotels));
    
    closeCmsModal();
    document.getElementById('cms-form').reset();
    navigateTo('home');
}

/* AUTH MODAL LOGIC */
function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

/* SCROLL ANIMATIONS */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}
