/* ==========================================================================
   HOUSE OF OAK — INTERACTION ENGINE & POPUP MONOGRAPH PUBLICATION SYSTEM
   Strictly Helvetica Neue execution across all dynamic elements.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Parallax Scroll Effect for Hero Backgrounds
  const parallaxBg = document.querySelectorAll('.hero-parallax-bg');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxBg.forEach((bg) => {
      bg.style.transform = `translateY(${scrolled * 0.22}px)`;
    });
  });

  // 2. Scroll Reveal Observer for Editorial Sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

  // 3. Slide-Out Archive Selection Drawer
  const cartHTML = `
    <div class="cart-overlay" id="cartOverlay"></div>
    <div class="cart-drawer" id="cartDrawer">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
        <span class="meta-tag" style="margin:0;">( Selection Archive )</span>
        <button id="closeCart" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-dark);">&times;</button>
      </div>
      <div id="cartItems" style="flex:1; overflow-y:auto; padding-right: 5px;">
        <p style="font-size:0.82rem; color:var(--text-muted);">Your selection archive is currently empty.</p>
      </div>
      <div style="margin-top:auto; padding-top:20px; border-top:1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; margin-bottom:16px; font-weight:600; font-size:0.9rem;">
          <span>Subtotal</span>
          <span id="cartSubtotal">€0</span>
        </div>
        <button onclick="alert('Order reservation request transmitted to studio concierge.')" style="width:100%; padding:14px; background:var(--text-dark); color:var(--bg-main); border:none; font-family:var(--font-helvetica); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.18em; cursor:pointer; transition:background 0.3s ease;">Reserve Selection</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);

  const header = document.querySelector('header');
  if (header && !document.querySelector('.cart-toggle-btn')) {
    const actions = document.createElement('div');
    actions.innerHTML = `<button class="cart-toggle-btn" id="openCart">Archive (<span id="cartCount">0</span>)</button>`;
    header.appendChild(actions);
  }

  let cart = [];
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const openCartBtn = document.getElementById('openCart');
  const closeCartBtn = document.getElementById('closeCart');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCount = document.getElementById('cartCount');

  function toggleCart(show) {
    if (show) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    } else {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  function updateCartUI() {
    cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">Your selection archive is currently empty.</p>`;
      cartSubtotal.innerText = '€0';
      return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      return `
        <div style="display:flex; justify-content:space-between; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid rgba(18,17,16,0.06);">
          <div>
            <div style="font-weight:600; font-size:0.85rem; margin-bottom:2px;">${item.name}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">Qty: ${item.qty}</div>
          </div>
          <div style="font-size:0.85rem; font-weight:600;">€${itemTotal.toLocaleString()}</div>
        </div>
      `;
    }).join('');
    cartSubtotal.innerText = `€${total.toLocaleString()}`;
  }

  // Universal Add-to-Archive Handler (Works on both index.html and collection.html)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.compact-add-btn, [data-archive]');
    if (!btn) return;

    e.stopPropagation();
    e.preventDefault();

    const card = btn.closest('.compact-card, .card, .product-card');
    
    const nameEl = card ? card.querySelector('h3, h4, .title') : null;
    const name = nameEl ? nameEl.innerText.trim() : (btn.getAttribute('data-name') || 'Oak Object');

    const priceEl = card ? card.querySelector('.price-tag, .price') : null;
    const priceText = priceEl ? priceEl.innerText : (btn.getAttribute('data-price') || '0');
    const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCartUI();
    toggleCart(true);
  });

  // 4. JOURNAL ISSUE POP-UP MODAL SYSTEM
  const journalArticles = {
    "1": {
      tag: "( ISSUE N° 01 — ARCHITECTURAL ESSAY )",
      title: "Monolithic Proportions in Scandinavian Living",
      meta: "Published: February 2026 — By Architect Henrik Lindqvist — 8 Min Read",
      img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      content: `
        <p>Contemporary interior architecture often succumbs to transient visual weightlessness—thin aluminum extrusions, hollow synthetic laminates, and disposable paneling. In contrast, Scandinavian monolithic proportions advocate for physical mass and permanence as foundational tenets of domestic peace.</p>
        <blockquote>"When an object possesses genuine structural mass, it stops competing with space and begins to define it."</blockquote>
        <p>At House of Oak, our exploration into heavy timber proportions centers on how unvarnished, solid white oak anchors a room. By increasing thickness across table planes and structural legs, we create a sense of gravitational stability that grounds the human psyche within modern minimalist interiors.</p>
        <p>This architectural weight is not ornamental; it dictates the acoustic and tactile atmosphere of a space. Solid timber dampens sound, absorbs ambient sunlight without glare, and ages with a tactile patina that synthetic materials simply cannot replicate.</p>
      `
    },
    "2": {
      tag: "( ISSUE N° 02 — MATERIAL STUDY )",
      title: "Tactile Longevity: Natural Wax vs. Synthetic Resin",
      meta: "Published: January 2026 — By Surface Specialist Ellen Holm — 6 Min Read",
      img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
      content: `
        <p>The choice between natural organic wax treatments and synthetic polyurethane coatings represents two fundamentally opposed philosophies of furniture design: living longevity versus plastic preservation.</p>
        <p>Polyurethane resins form a sealed plastic barrier over wood grain. While initially impervious, this barrier suffocates the timber, prevents natural moisture exchange, and micro-fractures over time into non-repairable cloudiness.</p>
        <blockquote>"Organic cold-pressed linseed oil and beeswax allow solid oak to breathe, self-heal minor surface abrasions, and cultivate a rich multi-decade patina."</blockquote>
        <p>Our workshop applies three coats of cold-pressed Scandinavian linseed oil, followed by hand-rubbed organic Danish beeswax. This treatment penetrates deep into the cellular structure of the oak, maintaining warmth and grain texture while ensuring simple, lifelong restoration.</p>
      `
    },
    "3": {
      tag: "( ISSUE N° 03 — SPATIAL THEORY )",
      title: "The Silence of Minimalist Spaces",
      meta: "Published: December 2025 — By Spatial Theorist Søren Møller — 10 Min Read",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      content: `
        <p>Visual clutter is mental noise. The architectural concept of 'spatial silence' relies not merely on empty rooms, but on the presence of unyielding, highly intentional furniture objects that eliminate distraction.</p>
        <p>When interior objects are reduced to essential geometric forms, human perception shifts from visual processing to tactile experience. The warmth of raw oak grain, the crisp shadow line of a mortise joint, and the weight of a hand-carved bench foster profound cognitive focus.</p>
        <blockquote>"True silence in design is achieved when nothing can be removed without compromising structural purpose."</blockquote>
        <p>Designing for silence requires immense restraint. It demands that we reject decorative trims and embrace raw material honesty, letting natural timber grain provide texture without visual volume.</p>
      `
    },
    "4": {
      tag: "( ISSUE N° 04 — ARCHITECTURE )",
      title: "Architectural Mass & Spatial Psychology",
      meta: "Published: November 2025 — By Dr. Astrid Nygård — 7 Min Read",
      img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      content: `
        <p>Human spatial psychology is deeply tied to mass and security. Lightweight, hollow furniture creates a subtle, subconscious sense of impermanence, whereas heavy, solid wood objects instill permanent sanctuary.</p>
        <p>Our research into Scandinavian timber mass demonstrates that individuals living in environments anchored by heavy natural materials experience lower cortisol levels and higher focus during creative work.</p>
        <blockquote>"Mass brings gravity. A room centered by solid oak feels established, serene, and enduring."</blockquote>
      `
    },
    "5": {
      tag: "( ISSUE N° 05 — CRAFTSMANSHIP )",
      title: "Sensory Tactility in Ebonized Oak",
      meta: "Published: October 2025 — By Master Artisan Mikko Rantanen — 9 Min Read",
      img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      content: `<p>Exploring deep-grain charring and organic oil finishes to evoke quiet tactile luxury in modern joinery.</p>`
    }
  };

  const journalModal = document.getElementById('journalModal');
  const journalOverlay = document.getElementById('journalOverlay');
  const journalModalBody = document.getElementById('journalModalBody');
  const closeJournalBtn = document.getElementById('closeJournalModal');

  function openJournalIssue(issueId) {
    const article = journalArticles[issueId];
    if (!article) return;

    journalModalBody.innerHTML = `
      <span class="meta-tag" style="margin-bottom:8px;">${article.tag}</span>
      <h2>${article.title}</h2>
      <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-muted); margin-bottom:20px;">${article.meta}</div>
      <div style="width:100%; height:320px; overflow:hidden; margin-bottom:25px; background:var(--bg-card);">
        <img src="${article.img}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      ${article.content}
    `;

    if (journalModal) journalModal.classList.add('active');
    if (journalOverlay) journalOverlay.classList.add('active');
  }

  function closeJournal() {
    if (journalModal) journalModal.classList.remove('active');
    if (journalOverlay) journalOverlay.classList.remove('active');
  }

  document.querySelectorAll('.journal-card-trigger').forEach(card => {
    card.addEventListener('click', () => {
      const issueId = card.getAttribute('data-issue');
      openJournalIssue(issueId);
    });
  });

  if (closeJournalBtn) closeJournalBtn.addEventListener('click', closeJournal);
  if (journalOverlay) journalOverlay.addEventListener('click', closeJournal);
});