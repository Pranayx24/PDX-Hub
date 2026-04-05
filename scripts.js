document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Elite UI: Custom Cursor & Aura ---
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const aura = document.getElementById('aura-blob');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        if (cursor) cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
        if (follower) follower.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
        if (aura) aura.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });

    // Hover effect for interactive elements
    document.querySelectorAll('a, button, input, .accordion-header').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (follower) follower.style.transform += ' scale(2)';
            if (follower) follower.style.borderColor = 'rgba(0, 113, 227, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            if (follower) follower.style.transform = follower.style.transform.replace(' scale(2)', '');
            if (follower) follower.style.borderColor = 'var(--accent-color)';
        });
    });

    // Theme Configuration
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }

    // --- 2. Calculator Logic ---
    function initCalculators() {
        // Setup Slack
        const setupInputs = ['setup-period', 'setup-data', 'setup-lib', 'setup-launch', 'setup-capture'];
        setupInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateSetup);
        });

        // Hold Slack
        const holdInputs = ['hold-data', 'hold-lib', 'hold-launch', 'hold-capture'];
        holdInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateHold);
        });

        // Freq/Period Converter
        const freqInput = document.getElementById('conv-freq');
        const periodInput = document.getElementById('conv-period');
        if (freqInput && periodInput) {
            freqInput.addEventListener('input', () => {
                periodInput.value = (1000 / freqInput.value).toFixed(0);
            });
            periodInput.addEventListener('input', () => {
                freqInput.value = (1000 / periodInput.value).toFixed(2);
            });
        }

        // Power Estimator
        ['power-cap', 'power-vdd', 'power-freq', 'power-alpha'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculatePower);
        });

        // RC Delay
        ['rc-res', 'rc-cap'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateRC);
        });

        // Wire R&C
        ['wire-len', 'wire-res-sq', 'wire-cap-um'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateWire);
        });

        // Fanout Delay
        ['fanout-base', 'fanout-drive', 'fanout-count', 'fanout-cap'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateFanout);
        });

        // Copy-to-Clipboard logic for result boxes
        document.querySelectorAll('.result-box').forEach(box => {
            box.style.cursor = 'pointer';
            box.addEventListener('click', () => {
                const text = box.querySelector('.result-value')?.textContent || box.textContent;
                copyToClipboard(text);
            });
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const toast = document.getElementById('toast-v');
            if (toast) {
                toast.classList.add('visible');
                setTimeout(() => toast.classList.remove('visible'), 2000);
            }
        });
    }

    function calculateSetup() {
        const period = parseFloat(document.getElementById('setup-period').value) || 0;
        const data = parseFloat(document.getElementById('setup-data').value) || 0;
        const lib = parseFloat(document.getElementById('setup-lib').value) || 0;
        const launch = parseFloat(document.getElementById('setup-launch').value) || 0;
        const capture = parseFloat(document.getElementById('setup-capture').value) || 0;
        const slack = (period + capture) - (launch + data + lib);
        const resultEl = document.getElementById('setup-result');
        resultEl.textContent = slack.toFixed(3) + ' ns';
        resultEl.parentElement.style.backgroundColor = slack < 0 ? '#ff3b30' : '#0071e3';
    }

    function calculateHold() {
        const data = parseFloat(document.getElementById('hold-data').value) || 0;
        const lib = parseFloat(document.getElementById('hold-lib').value) || 0;
        const launch = parseFloat(document.getElementById('hold-launch').value) || 0;
        const capture = parseFloat(document.getElementById('hold-capture').value) || 0;
        const slack = (launch + data) - (capture + lib);
        const resultEl = document.getElementById('hold-result');
        resultEl.textContent = slack.toFixed(3) + ' ns';
        resultEl.parentElement.style.backgroundColor = slack < 0 ? '#ff3b30' : '#34c759';
    }

    function calculatePower() {
        const C = parseFloat(document.getElementById('power-cap').value) || 0; // pF
        const V = parseFloat(document.getElementById('power-vdd').value) || 0;
        const F = parseFloat(document.getElementById('power-freq').value) || 0; // MHz
        const A = parseFloat(document.getElementById('power-alpha').value) || 0;
        const P = A * C * (V * V) * F; // Scaling works out to mW
        document.getElementById('power-result').textContent = P.toFixed(3) + ' mW';
    }

    function calculateRC() {
        const R = parseFloat(document.getElementById('rc-res').value) || 0; // Ohms
        const C = parseFloat(document.getElementById('rc-cap').value) || 0; // fF
        const T = (R * C) / 1000; // Result in ps
        document.getElementById('rc-result').textContent = T.toFixed(3) + ' ps';
    }

    function calculateWire() {
        const len = parseFloat(document.getElementById('wire-len').value) || 0;
        const res_sq = parseFloat(document.getElementById('wire-res-sq').value) || 0;
        const cap_um = parseFloat(document.getElementById('wire-cap-um').value) || 0;
        
        const total_r = len * res_sq; // simplified R = (L/W)*Rs, assuming W=1 for unit calc
        const total_c = len * cap_um;
        
        document.getElementById('wire-res-res').textContent = `R: ${total_r.toFixed(1)} Ω`;
        document.getElementById('wire-cap-res').textContent = `C: ${total_c.toFixed(1)} fF`;
    }

    function calculateFanout() {
        const t_base = parseFloat(document.getElementById('fanout-base').value) || 0;
        const drive = parseFloat(document.getElementById('fanout-drive').value) || 0;
        const count = parseFloat(document.getElementById('fanout-count').value) || 0;
        const cap = parseFloat(document.getElementById('fanout-cap').value) || 0;
        
        const delay = t_base + (drive * (count * cap));
        document.getElementById('fanout-result').textContent = delay.toFixed(2) + ' ps';
    }

    // --- 3. Reveal Animation (Intersection Observer) ---
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 4. Accordion Logic (Interview Prep) ---
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = content.classList.contains('active');
            
            // Close others
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.querySelector('span').textContent = '+';
            });

            if (!isOpen) {
                content.classList.add('active');
                header.classList.add('active');
                header.querySelector('span').textContent = '-';
            }
        });
    });

    // --- 5. Search Logic ---
    const searchInput = document.getElementById('search-interview');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            document.querySelectorAll('.accordion-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(val) ? 'block' : 'none';
            });
        });
    }

    // --- 6. Scroll Progress & Button ---
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) progressBar.style.width = scrolled + '%';

        const scrollBtn = document.getElementById('scroll-to-top');
        if (scrollBtn) {
            scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        }
    });

    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initCalculators();
});
