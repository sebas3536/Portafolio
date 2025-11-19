// ============================================
// 1. CONFIGURACIÓN INICIAL OPTIMIZADA
// ============================================

const CONFIG = {
    animationDuration: 400, // Reducido para más fluidez
    particleCount: 30, // Reducido para mejor performance
    observerThreshold: 0.05, // Más sensible
    observerRootMargin: '0px 0px -50px 0px',
    useWillChange: true // Para habilitar optimizaciones CSS
};

// ============================================
// 2. LOADER MEJORADO
// ============================================

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Usar requestAnimationFrame para mejor timing
    requestAnimationFrame(() => {
        setTimeout(() => {
            loader.classList.add('hidden');
            initializeApp();
        }, 800); // Reducido el tiempo de carga
    });
});

function initializeApp() {
    // Inicializar en orden de prioridad
    initScrollAnimations();
    initNavigation();
    initPortfolioFilters();
    initThemeToggle();
    initClientRouter(); 
    initErrorHandling(); 
    
    // Inicializar efectos menos críticos después
    requestAnimationFrame(() => {
        initParticles();
        initSmoothScroll();
        initParallax();
    });
}

// ============================================
// 3. ANIMACIONES DE SCROLL OPTIMIZADAS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.observerThreshold,
        rootMargin: CONFIG.observerRootMargin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                
                // Optimizar contadores con RAF
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const target = parseInt(statNumber.getAttribute('data-target'));
                    requestAnimationFrame(() => animateNumber(statNumber, target));
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        if (CONFIG.useWillChange) {
            el.style.willChange = 'transform, opacity';
        }
        observer.observe(el);
    });
}

// ============================================
// 4. NAVEGACIÓN OPTIMIZADA
// ============================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (!hamburger || !navMenu || !navbar) return;

    // Toggle menú móvil optimizado
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Cerrar menú optimizado
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Scroll navbar con throttling
    let lastScroll = 0;
    let ticking = false;
    
    const updateNavbar = () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled', 'hidden');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
            navbar.classList.add('scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// ============================================
// 5. FILTROS DEL PORTAFOLIO ULTRA FLUIDOS
// ============================================

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let activeFilter = 'todos';

    // Pre-cache de elementos para mejor performance
    const itemsArray = Array.from(portfolioItems);

    function filterProjects(filter) {
        activeFilter = filter;
        
        itemsArray.forEach((item, index) => {
            const categories = item.getAttribute('data-category').split(' ');
            const shouldShow = filter === 'todos' || categories.includes(filter);
            
            // Usar transform y opacity para animaciones GPU-aceleradas
            if (shouldShow) {
                item.style.display = 'flex';
                item.style.pointerEvents = 'auto';
                
                // Animación escalonada con RAF
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, index * 50); // Reducido el delay
                });
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.95)';
                item.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    if (activeFilter === filter) {
                        item.style.display = 'none';
                    }
                }, 200); // Match con la duración de la transición CSS
            }
        });
    }

    // Event listeners optimizados
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualización visual inmediata
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Usar RAF para mejor responsividad
            requestAnimationFrame(() => {
                filterProjects(filter);
            });
        });
    });

    // Inicialización
    const activeBtn = document.querySelector('.filter-btn.active') || 
                     document.querySelector('[data-filter="todos"]');
    if (activeBtn) {
        activeBtn.classList.add('active');
        filterProjects(activeBtn.getAttribute('data-filter'));
    }
}

// ============================================
// 6. PARTÍCULAS OPTIMIZADAS
// ============================================

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Limpiar partículas existentes
    particlesContainer.innerHTML = '';

    for (let i = 0; i < CONFIG.particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 1; // Partículas más pequeñas
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 15 + 8; // Duración reducida

    // Estilos optimizados
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--primary-color);
        border-radius: 50%;
        left: ${startX}px;
        top: ${startY}px;
        opacity: ${Math.random() * 0.2 + 0.1};
        animation: float-particle ${duration}s ${Math.random() * 5}s infinite ease-in-out;
        pointer-events: none;
        ${CONFIG.useWillChange ? 'will-change: transform;' : ''}
    `;

    container.appendChild(particle);
}

// ============================================
// 7. THEME TOGGLE MEJORADO
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Verificación inicial rápida
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }

    // Event listener delegado
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        requestAnimationFrame(() => toggleTheme());
    });

    // Observer para cambios del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            requestAnimationFrame(() => {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
                updateThemeToggle();
            });
        }
    });
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.classList.add('changing');

    // Aplicar cambios inmediatamente
    if (isDark) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }

    updateThemeToggle();

    setTimeout(() => {
        themeToggle.classList.remove('changing');
    }, 400); // Duración reducida
}

function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const isDark = document.body.classList.contains('dark-mode');

    if (!themeToggle) return;

    themeToggle.setAttribute('aria-label', isDark ? 
        'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    themeToggle.setAttribute('aria-pressed', isDark);
    themeToggle.title = isDark ? 'Modo oscuro (Cambiar a claro)' : 'Modo claro (Cambiar a oscuro)';
}

// ============================================
// 8. SMOOTH SCROLL MEJORADO
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                // Smooth scroll nativo con behavior smooth
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 9. PARALLAX OPTIMIZADO
// ============================================

function initParallax() {
    let ticking = false;
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');
    const floatingIcons = document.querySelectorAll('.floating-icon');

    // Verificar si los elementos existen
    if (!heroText && !heroVisual && floatingIcons.length === 0) return;

    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        if (scrolled < windowHeight) {
            if (heroText) {
                heroText.style.transform = `translateY(${scrolled * 0.2}px)`; // Reducido el efecto
            }
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            
            floatingIcons.forEach((icon, index) => {
                const speed = 0.1 + (index * 0.03); // Velocidades reducidas
                icon.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ============================================
// 10. FORMULARIO OPTIMIZADO
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Feedback inmediato
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
        Enviando...
    `;

    // Simular envío con timeouts optimizados
    setTimeout(() => {
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ¡Enviado!
        `;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            e.target.reset();
        }, 1500);
    }, 1000);
}

// ============================================
// 11. ANIMACIÓN DE NÚMEROS OPTIMIZADA
// ============================================

function animateNumber(element, target) {
    const startValue = parseInt(element.innerText.replace('+', '') || 0);
    const duration = CONFIG.animationDuration;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para suavidad
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = `+${currentValue}`;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = `+${target}`;
        }
    }

    requestAnimationFrame(updateNumber);
}

// ============================================
// 12. OPTIMIZACIONES ADICIONALES
// ============================================

// Prevenir layout shifts
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que las imágenes tengan dimensiones
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('width') && img.naturalWidth) {
            img.setAttribute('width', img.naturalWidth);
        }
        if (!img.hasAttribute('height') && img.naturalHeight) {
            img.setAttribute('height', img.naturalHeight);
        }
    });
});

// Optimizar resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalcular partículas en resize
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            initParticles();
        }
    }, 250);
});

// Cleanup para mejor performance
window.addEventListener('beforeunload', () => {
    // Limpiar event listeners y timeouts
    const animations = document.querySelectorAll('.animate-on-scroll');
    animations.forEach(el => {
        el.style.willChange = 'auto';
    });
});

// ============================================
// SCROLLSPY 
// ============================================

const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
    try {
        let fromTop = window.scrollY + 150;

        sections.forEach(section => {
            const id = section.getAttribute("id");
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (!link) return;

            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                link.classList.add("active");
                
                // Actualizar el hash en la URL
                if (window.location.hash !== `#${id}`) {
                    window.history.replaceState(null, null, `#${id}`);
                }
            }
        });
    } catch (error) {
        console.warn('Error en scrollspy:', error);
    }
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();


// ============================================
// 13. ROUTER CLIENT-SIDE PARA MANEJAR RUTAS NO VÁLIDAS
// ============================================

function initClientRouter() {
    // Lista de rutas válidas en tu aplicación
    const validRoutes = [
        'inicio', 'sobre-mi', 'experiencia', 
        'habilidades', 'portafolio', 'contacto'
    ];

    // Función para verificar y corregir la ruta actual
    function checkAndFixRoute() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash.replace('#', '');
        
        // Si la ruta no es index2.html o tiene rutas inválidas, redirigir al inicio
        if (!currentPath.endsWith('index2.html') && !currentPath.endsWith('/')) {
            console.warn('Ruta no válida detectada, redirigiendo al inicio...');
            window.history.replaceState(null, null, 'index2.html#inicio');
            scrollToSection('inicio');
            return;
        }

        // Si hay un hash pero no es válido, redirigir al inicio
        if (currentHash && !validRoutes.includes(currentHash)) {
            console.warn(`Hash no válido: ${currentHash}, redirigiendo al inicio...`);
            window.location.hash = 'inicio';
            scrollToSection('inicio');
            return;
        }

        // Si no hay hash, establecer el por defecto
        if (!currentHash) {
            window.location.hash = 'inicio';
        }
    }

    // Función auxiliar para hacer scroll a una sección
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth' });
                updateActiveNav(sectionId);
            }, 100);
        }
    }

    // Manejar cambios en la URL
    function handleUrlChange() {
        const hash = window.location.hash.replace('#', '');
        
        if (hash && validRoutes.includes(hash)) {
            scrollToSection(hash);
        } else if (hash) {
            // Hash no válido - redirigir al inicio
            window.location.hash = 'inicio';
        }
    }

    // Escuchar eventos de cambio de hash
    window.addEventListener('hashchange', handleUrlChange);
    
    // Escuchar eventos de popstate (navegación con botones adelante/atrás)
    window.addEventListener('popstate', function() {
        setTimeout(handleUrlChange, 50);
    });

    // Verificar la ruta al cargar la página
    window.addEventListener('load', function() {
        setTimeout(() => {
            checkAndFixRoute();
            handleUrlChange();
        }, 100);
    });

    // También verificar cuando se hace clic en enlaces
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')?.startsWith('#')) {
            const href = link.getAttribute('href').replace('#', '');
            if (!validRoutes.includes(href)) {
                e.preventDefault();
                window.location.hash = 'inicio';
            }
        }
    });

    // Interceptar navegación para prevenir errores 404
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        if (url && typeof url === 'string' && !url.includes('index2.html') && !url.startsWith('#')) {
            console.warn('Intento de navegación a ruta no válida interceptada:', url);
            return originalPushState.call(history, state, title, 'index2.html#inicio');
        }
        return originalPushState.call(history, state, title, url);
    };
}

// ============================================
// 14. FUNCIÓN MEJORADA PARA ACTUALIZAR NAVEGACIÓN ACTIVA
// ============================================

function updateActiveNav(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remover clase activa de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase activa al enlace correspondiente
    const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ============================================
// 15. MANEJO DE ERRORES GLOBAL
// ============================================

function initErrorHandling() {
    // Manejar errores no capturados
    window.addEventListener('error', function(e) {
        console.error('Error global capturado:', e.error);
        
        // Si es un error de ruta, redirigir al inicio
        if (e.error && e.error.message && e.error.message.includes('GET')) {
            window.location.href = 'index2.html#inicio';
        }
    });

    // Manejar promesas rechazadas no capturadas
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada:', e.reason);
    });

    // Prevenir comportamiento por defecto en enlaces rotos
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('/') && !href.includes('index2.html')) {
                e.preventDefault();
                window.location.hash = 'inicio';
            }
        }
    });
}