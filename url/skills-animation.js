document.addEventListener('DOMContentLoaded', () => {
    const svg = document.querySelector('.brain-svg');
    if (!svg) return;

    const lineGroup = document.getElementById('dynamic-lines');
    const circles = Array.from(svg.querySelectorAll('circle'));
    const viewBox = svg.viewBox.baseVal;

    // Animation parameters
    const MAX_SPEED = 0.3; // Initial random speed
    const CONNECTION_DISTANCE = 150; // Increased distance for larger nodes
    const DAMPING = 0.98; // Slows down nodes over time (prevents excessive speed)    
    const REPULSION_STRENGTH = 0.5; // How strongly nodes push each other apart. 1 is full repulsion.
    const JITTER_STRENGTH = 0.08; // Increased random force to keep nodes moving perpetually.

    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;

    // Create a state for each circle
    const nodes = circles.map(circle => {
        const image = circle.nextElementSibling; // Get the sibling image element
        const imageSize = image ? parseFloat(image.getAttribute('width')) : 0;
        return {
            element: circle,
            image: image,
            imageSize: imageSize,
            x: parseFloat(circle.getAttribute('cx')),
            y: parseFloat(circle.getAttribute('cy')),
            vx: (Math.random() - 0.5) * MAX_SPEED,
            vy: (Math.random() - 0.5) * MAX_SPEED,
            radius: parseFloat(circle.getAttribute('r'))
        };
    });

    function animate() {
        // Clear previous lines for redrawing
        lineGroup.innerHTML = '';

        // 1. Apply forces (gravity and repulsion)
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];

            // Repulsion pushes nodes away from each other
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];

                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = nodeA.radius + nodeB.radius;

                if (distance < minDistance) {
                    // Nodes are overlapping.
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistance - distance;

                    // 1. Positional Correction: Immediately move nodes apart to prevent sticking.
                    const correctionX = Math.cos(angle) * overlap * 0.5; // Each node moves by half the overlap
                    const correctionY = Math.sin(angle) * overlap * 0.5;
                    nodeA.x += correctionX;
                    nodeA.y += correctionY;
                    nodeB.x -= correctionX;
                    nodeB.y -= correctionY;

                    // 2. Velocity-based Repulsion: Apply a force to make them "bounce" off each other.
                    const force = overlap * REPULSION_STRENGTH;
                    const forceX = Math.cos(angle) * force * 0.5; // Apply half the force to each node
                    const forceY = Math.sin(angle) * force * 0.5;
                    nodeA.vx += forceX;
                    nodeA.vy += forceY;
                    nodeB.vx -= forceX;
                    nodeB.vy -= forceY;
                }
            }
        }

        // 2. Update positions, apply damping, and handle boundaries
        nodes.forEach(node => {
            // Add a small random jitter to keep them moving dynamically
            node.vx += (Math.random() - 0.5) * JITTER_STRENGTH;
            node.vy += (Math.random() - 0.5) * JITTER_STRENGTH;

            // Apply damping to slow down
            node.vx *= DAMPING;
            node.vy *= DAMPING;

            // Update position based on velocity
            node.x += node.vx;
            node.y += node.vy;

            // Wrap nodes around the screen when they go off-screen
            if (node.x + node.radius < viewBox.x) node.x = viewBox.x + viewBox.width + node.radius;
            if (node.x - node.radius > viewBox.x + viewBox.width) node.x = viewBox.x - node.radius;
            if (node.y + node.radius < viewBox.y) node.y = viewBox.y + viewBox.height + node.radius;
            if (node.y - node.radius > viewBox.y + viewBox.height) node.y = viewBox.y - node.radius;

            // Update SVG circle and image elements in the DOM
            node.element.setAttribute('cx', node.x);
            node.element.setAttribute('cy', node.y);
            if (node.image) {
                node.image.setAttribute('x', node.x - node.imageSize / 2);
                node.image.setAttribute('y', node.y - node.imageSize / 2);
            }
        });

        // 3. Draw connection lines based on new positions
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];

                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONNECTION_DISTANCE) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', nodeA.x);
                    line.setAttribute('y1', nodeA.y);
                    line.setAttribute('x2', nodeB.x);
                    line.setAttribute('y2', nodeB.y);
                    
                    // Make lines fade with distance
                    const opacity = 1 - (distance / CONNECTION_DISTANCE);
                    line.style.stroke = 'rgba(56, 189, 248, 0.6)'; // Vibrant light blue, semi-transparent
                    line.style.strokeWidth = '1.5';
                    line.style.opacity = opacity;

                    lineGroup.appendChild(line);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();
});