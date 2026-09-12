document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Cursor
    const cursor = document.querySelector(".cursor");
    if (cursor) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        function renderCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);
    }

    // 2. Working Accordion Engine (+ button expansion)
    const accordions = document.querySelectorAll(".accordion-item");
    accordions.forEach(item => {
        const header = item.querySelector(".accordion-header");
        if (header) {
            header.addEventListener("click", (e) => {
                e.stopPropagation();
                const isActive = item.classList.contains("active");
                accordions.forEach(acc => acc.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });

    // 3. Alphabet-by-Alphabet Scroll Reveal Engine
    const revealEl = document.getElementById("scrollRevealText");
    if (revealEl) {
        const text = revealEl.textContent;
        revealEl.innerHTML = text.split("").map(char => 
            char === " " ? `<span class="char">&nbsp;</span>` : `<span class="char">${char}</span>`
        ).join("");

        const chars = revealEl.querySelectorAll(".char");

        window.addEventListener("scroll", () => {
            const rect = revealEl.getBoundingClientRect();
            const windowH = window.innerHeight;
            let progress = (windowH - rect.top) / (windowH * 0.8);
            progress = Math.max(0, Math.min(1, progress));
            
            const revealLimit = Math.floor(progress * chars.length * 1.2);
            chars.forEach((char, idx) => {
                if (idx <= revealLimit) {
                    char.classList.add("revealed");
                } else {
                    char.classList.remove("revealed");
                }
            });
        }, { passive: true });
    }

    // 4. Hero Typewriter Effect
    const words = ["visual designers", "motion artists", "brand architects", "web innovators"];
    let i = 0, j = 0, currentWord = "", isDeleting = false;
    const twEl = document.getElementById("typewriter");
    if (twEl) {
      function typeWriter() {
        currentWord = words[i];
        if (isDeleting) {
          twEl.textContent = currentWord.substring(0, j--);
          if (j < 0) { isDeleting = false; i = (i + 1) % words.length; setTimeout(typeWriter, 400); return; }
        } else {
          twEl.textContent = currentWord.substring(0, j++);
          if (j > currentWord.length) { isDeleting = true; setTimeout(typeWriter, 1800); return; }
        }
        setTimeout(typeWriter, isDeleting ? 70 : 110);
      }
      setTimeout(typeWriter, 600);
    }

    // 5. Gallery Card Tilt
    const cards = document.querySelectorAll(".gallery-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const dx = (x - rect.width / 2) / 20;
            const dy = (rect.height / 2 - y) / 20;
            card.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${dy}deg) translateY(-6px)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
        });
    });
});
