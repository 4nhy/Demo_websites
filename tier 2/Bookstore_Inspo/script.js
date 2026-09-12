document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    document.querySelectorAll(".parallax-floating-img").forEach((img, index) => {
        const speed = (index + 1) * 18;
        img.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px) rotate(${index * 6 - 8}deg)`;
    });
});
