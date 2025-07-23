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


  circle.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
    tooltipLevel.style.width = "0%";
  });
});

const HomeMenu = document.querySelector('.home-menu');
HomeMenu.addEventListener('click', (event) => {
      console.log(event);
      console.log(HomeMenu.classList);
      HomeMenu.classList.toggle("active");
    });

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

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent actual form submission

  const name = document.getElementById("name-input").value.trim();
  const email = document.getElementById("email-input").value.trim();
  const message = document.getElementById("message-input").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Simulated form submission
  alert(`Thanks ${name}, your message has been sent!`);

  // Reset the form
  document.getElementById("contact-form").reset();
});
