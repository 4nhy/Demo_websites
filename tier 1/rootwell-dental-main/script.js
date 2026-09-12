// SERVICE ACCORDION TOGGLE
function toggleService(rowElement) {
    const allRows = document.querySelectorAll('.service-row');
    allRows.forEach(row => {
        if (row !== rowElement) {
            row.classList.remove('active');
        }
    });
    rowElement.classList.toggle('active');
}

// FORM SUBMISSION HANDLING
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.display = 'none';
            const successBox = document.getElementById('successBox');
            if (successBox) {
                successBox.style.display = 'block';
            }
        }, 300);
    });
}

// SCROLL REVEAL MOTION OBSERVER
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observerInstance.unobserve(entry.target); // Animate only once per element
            }
        });
    }, observerOptions);

    // Target elements across your pages to animate smoothly on scroll
const animatedElements = document.querySelectorAll('section, .pillar-item, .team-member-row, .editorial-grid > div');
    
    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});