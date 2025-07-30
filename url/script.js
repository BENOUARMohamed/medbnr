window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    // Animate letters for the preloader
    const loaderH2 = document.querySelector('.loader-logo h2');
    const loaderH6 = document.querySelector('.loader-logo h6');

    if (loaderH2) {
        const text = loaderH2.textContent;
        loaderH2.innerHTML = text.split('').map((char, i) => `<span style="animation-delay: ${i * 50}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    }
    if (loaderH6) {
        const text = loaderH6.textContent;
        // Delay the subtitle animation
        loaderH6.innerHTML = text.split('').map((char, i) => `<span style="animation-delay: ${(i * 40) + 500}ms">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    }

    if (preloader) {
        // Use a timeout to hide the preloader after the letter animation completes
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.add('loaded');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            });
        }, 2500); // This duration should be long enough for the animation to play
    }
});

// Scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing the element after it has become visible to prevent re-animation
            observer.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
});

// Observe all elements with the 'animate-on-scroll' class
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
elementsToAnimate.forEach(el => observer.observe(el));

const tooltip = document.getElementById("tooltip");
const tooltipSkill = document.getElementById("tooltip-skill");
const tooltipLevel = document.getElementById("tooltip-level");

document.querySelectorAll(".brain-svg circle").forEach(circle => {
  circle.addEventListener("mouseenter", e => {
    const skill = circle.getAttribute("data-skill");
    const level = circle.getAttribute("data-level");
    if (skill && level) {
      tooltipSkill.textContent = `Skill: ${skill}`;
      tooltipLevel.style.width = `${level * 10}%`;
      tooltip.style.display = "block";
    }
  });

  circle.addEventListener("mousemove", e => {
    // The tooltip's parent is .brain-wrapper, which has position: relative.
    // We need to calculate the mouse position relative to this wrapper.
    const wrapperRect = e.currentTarget.closest('.brain-wrapper').getBoundingClientRect();
    
    // e.clientX/Y is relative to the viewport.
    // wrapperRect.left/top is also relative to the viewport.
    // The difference gives us the position inside the wrapper.
    const left = e.clientX - wrapperRect.left;
    const top = e.clientY - wrapperRect.top;

    // Position the tooltip with an offset from the cursor
    tooltip.style.left = `${left + 20}px`; 
    tooltip.style.top = `${top}px`;
  });

  circle.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
    tooltipLevel.style.width = "0%";
  });
});

const homeMenu = document.querySelector('.home-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

homeMenu.addEventListener('click', () => {
  homeMenu.classList.toggle('active');
  navbar.classList.toggle('active');
});

// Close mobile menu when a navigation link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Check if the mobile menu is active before closing
        if (navbar.classList.contains('active')) {
            homeMenu.classList.remove('active');
            navbar.classList.remove('active');
        }
    });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const header = document.querySelector('.header');

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const numLayers = 3; // Number of parallax layers
const starsPerLayer = numStars / numLayers;
const wind = { x: 0.1, y: 0.05 }; // Wind influence (optional)

// Moved scroll listener outside of resizeCanvas to prevent creating multiple listeners
window.addEventListener('scroll', () => {
    // Add 'scrolled' class to header on scroll for animation
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) { // 150px offset to trigger earlier
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});
stars = [];

function createStars() {
    stars = [];
    for (let layer = 0; layer < numLayers; layer++) {
        for (let i = 0; i < starsPerLayer; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * (0.3 + layer * 0.3) + wind.x,
                dy: (Math.random() - 0.5) * (0.3 + layer * 0.3) + wind.y,
                size: 1,
                baseOpacity: Math.random() * 0.6 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                colorHue: Math.random() * 360,
                layer,
            });
        }
    }
}


function drawStars() {
    ctx.fillStyle = "#0f1123";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        // Move star
        star.x += star.dx;
        star.y += star.dy;

        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle logic
        star.twinklePhase += star.twinkleSpeed;
        const opacity = star.baseOpacity + 0.3 * Math.sin(star.twinklePhase);

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.colorHue}, 100%, 85%, ${opacity})`;
        ctx.fill();
    }

    requestAnimationFrame(drawStars);
}


window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
});

resizeCanvas();
createStars();
drawStars();

const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default submission

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  // Basic client-side validation
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Start animation and disable button
  submitButton.classList.add('sending');
  submitButton.disabled = true;

  // Use fetch to submit to web3forms
  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Fade out the form
      contactForm.style.transition = 'opacity 0.5s ease-out';
      contactForm.style.opacity = '0';
      // After fade out, hide form and show success message
      setTimeout(() => {
        contactForm.style.display = 'none';
        successMessage.classList.add('visible');
      }, 500); // Match transition duration
    } else {
      alert(data.message || "An error occurred.");
      submitButton.classList.remove('sending');
      submitButton.disabled = false;
    }
  })
  .catch(error => {
    console.error("Form submission error:", error);
    alert("An error occurred. Please try again later.");
    submitButton.classList.remove('sending');
    submitButton.disabled = false;
  });
});
