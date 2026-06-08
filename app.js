/* ==========================================
   CYBERSAFE JAVASCRIPT
   Interactions: Navigation scroll effects, Mobile Menu, and Particle background
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // === 0. Cyber Canvas Motherboard Background ===
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initCircuits();
        });

        // Particles
        const particles = [];
        const particleCount = 45;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.8,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * 0.015 + 0.005,
                pulseDir: 1
            });
        }

        // Circuits
        let nodes = [];
        let connections = [];
        let pulses = [];

        function initCircuits() {
            nodes = [];
            connections = [];
            pulses = [];

            // Define grid size based on screen size
            const step = Math.min(width, height) > 768 ? 160 : 120;
            const cols = Math.ceil(width / step);
            const rows = Math.ceil(height / step);

            // Generate nodes on grid points with minor randomness
            for (let c = 0; c <= cols; c++) {
                for (let r = 0; r <= rows; r++) {
                    if (Math.random() > 0.45) {
                        nodes.push({
                            id: `${c}_${r}`,
                            x: c * step + (Math.random() - 0.5) * (step * 0.4),
                            y: r * step + (Math.random() - 0.5) * (step * 0.4),
                            glow: 0
                        });
                    }
                }
            }

            // Create connections (45 and 90 degree patterns)
            nodes.forEach(node => {
                const targets = nodes.filter(n => {
                    if (n.id === node.id) return false;
                    const dx = Math.abs(n.x - node.x);
                    const dy = Math.abs(n.y - node.y);
                    return (dx < step * 1.5 && dy < step * 1.5) && (dx < 30 || dy < 30 || Math.abs(dx - dy) < 30);
                });

                const connectLimit = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < Math.min(targets.length, connectLimit); i++) {
                    const target = targets[i];
                    const exists = connections.some(c => (c.from === node && c.to === target) || (c.from === target && c.to === node));
                    if (!exists) {
                        connections.push({ from: node, to: target });
                    }
                }
            });

            // Initialize moving pulses
            const pulseCount = Math.min(8, Math.max(3, Math.floor(width / 200)));
            for (let i = 0; i < pulseCount; i++) {
                spawnPulse();
            }
        }

        function spawnPulse() {
            if (connections.length === 0) return;
            const conn = connections[Math.floor(Math.random() * connections.length)];
            pulses.push({
                conn: conn,
                progress: 0,
                speed: Math.random() * 0.006 + 0.003,
                color: 'rgba(0, 191, 255, 0.85)'
            });
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw circuit tracks (static/slow glowing lines)
            ctx.lineWidth = 1;
            connections.forEach(conn => {
                let isGlowing = false;
                if (mouse.x !== null && mouse.y !== null) {
                    const distToLine = getDistanceToSegment(mouse, conn.from, conn.to);
                    if (distToLine < 100) {
                        isGlowing = true;
                    }
                }

                ctx.strokeStyle = isGlowing ? 'rgba(0, 191, 255, 0.22)' : 'rgba(0, 191, 255, 0.06)';
                ctx.beginPath();
                ctx.moveTo(conn.from.x, conn.from.y);
                ctx.lineTo(conn.to.x, conn.to.y);
                ctx.stroke();
            });

            // Update & draw pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const pulse = pulses[i];
                pulse.progress += pulse.speed;
                if (pulse.progress >= 1) {
                    pulses.splice(i, 1);
                    spawnPulse();
                    continue;
                }

                const x = pulse.conn.from.x + (pulse.conn.to.x - pulse.conn.from.x) * pulse.progress;
                const y = pulse.conn.from.y + (pulse.conn.to.y - pulse.conn.from.y) * pulse.progress;

                ctx.shadowBlur = 8;
                ctx.shadowColor = '#00BFFF';
                ctx.fillStyle = pulse.color;
                ctx.beginPath();
                ctx.arc(x, y, 2.2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(0, 191, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pulse.conn.from.x + (pulse.conn.to.x - pulse.conn.from.x) * Math.max(0, pulse.progress - 0.1), pulse.conn.from.y + (pulse.conn.to.y - pulse.conn.from.y) * Math.max(0, pulse.progress - 0.1));
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            // Update & draw nodes
            nodes.forEach(node => {
                let nodeGlow = 0;
                if (mouse.x !== null && mouse.y !== null) {
                    const dist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
                    if (dist < 120) {
                        nodeGlow = (1 - dist / 120) * 0.5;
                    }
                }
                node.glow += (nodeGlow - node.glow) * 0.1;

                ctx.fillStyle = `rgba(0, 191, 255, ${0.12 + node.glow})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fill();

                if (node.glow > 0.08) {
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = '#00BFFF';
                    ctx.strokeStyle = `rgba(0, 191, 255, ${node.glow * 0.8})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            });

            // Update & draw particles
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;

                p.alpha += p.pulse * p.pulseDir;
                if (p.alpha > 0.55 || p.alpha < 0.12) {
                    p.pulseDir *= -1;
                }

                ctx.fillStyle = `rgba(0, 191, 255, ${p.alpha})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#00BFFF';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
        }

        function getDistanceToSegment(p, a, b) {
            const A = p.x - a.x;
            const B = p.y - a.y;
            const C = b.x - a.x;
            const D = b.y - a.y;

            const dot = A * C + B * D;
            const lenSq = C * C + D * D;
            let param = -1;
            if (lenSq !== 0) param = dot / lenSq;

            let xx, yy;
            if (param < 0) {
                xx = a.x;
                yy = a.y;
            } else if (param > 1) {
                xx = b.x;
                yy = b.y;
            } else {
                xx = a.x + param * C;
                yy = a.y + param * D;
            }

            const dx = p.x - xx;
            const dy = p.y - yy;
            return Math.hypot(dx, dy);
        }

        initCircuits();
        animate();
    }

    // 2. Sticky Navbar and Active Links Scroll Tracking (With dynamic Parallax effects)
    const header = document.querySelector('.navbar-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky class toggle
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Multi-layered Parallax scrolling effects
        const circuitBg = document.querySelector('.circuit-bg-container');
        const glowOrbs = document.querySelector('.glow-orbs');
        const canvasBg = document.getElementById('cyber-canvas');
        const shieldWrapper = document.querySelector('.hero-left');

        if (circuitBg) circuitBg.style.transform = `translateY(${scrollY * 0.22}px)`;
        if (glowOrbs) glowOrbs.style.transform = `translateY(${scrollY * 0.32}px)`;
        if (canvasBg) canvasBg.style.transform = `translateY(${scrollY * 0.15}px)`;
        if (shieldWrapper && window.innerWidth > 768) {
            shieldWrapper.style.transform = `translateY(${-scrollY * 0.1}px)`;
        }

        // Active link highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const toggleIcon = document.getElementById('toggleIcon');
    const body = document.body;

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            
            // Lock background scroll when mobile menu is active
            if (isActive) {
                body.style.overflow = 'hidden';
                toggleIcon.setAttribute('data-lucide', 'x');
            } else {
                body.style.overflow = '';
                toggleIcon.setAttribute('data-lucide', 'menu');
            }
            
            // Re-render lucide icon
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                    toggleIcon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    }

    // 4. Smooth scroll function for all anchor links including the button
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});