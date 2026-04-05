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

        // Slew Rate
        ['slew-in', 'slew-load', 'slew-res'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateSlew);
        });

        // Unit Converter Pro
        ['unit-from', 'unit-to', 'unit-val'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateUnits);
        });

        // Timing Path Visualizer
        const addStageBtn = document.getElementById('add-stage');
        if (addStageBtn) addStageBtn.addEventListener('click', addPathStage);

        // Omni-Search Logic
        const omniInput = document.getElementById('omni-search');
        if (omniInput) {
            omniInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                // Site-wide filtering logic
                document.querySelectorAll('.card, .tool-card, .cheat-item, .accordion-item, .learn-section, .btn').forEach(el => {
                    const text = el.textContent.toLowerCase();
                    el.style.display = text.includes(val) ? '' : 'none';
                });
            });
        }

        // Interview Simulator Logic
        const startSimBtn = document.getElementById('start-sim');
        if (startSimBtn) startSimBtn.addEventListener('click', startInterviewQuiz);

        // Logical Effort
        ['eff-f', 'eff-g'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calculateLogicEffort);
        });

        // Sign-off Checklist
        document.querySelectorAll('.signoff-check').forEach(check => {
            check.addEventListener('change', updateSignoffStatus);
        });

        // Initialize Home Dashboard
        updateHomeDashboard();

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

    function calculateSlew() {
        const s_in = parseFloat(document.getElementById('slew-in').value) || 0;
        const load = parseFloat(document.getElementById('slew-load').value) || 0;
        const res = parseFloat(document.getElementById('slew-res').value) || 1000;
        const delay_rc = 2.2 * (res * (load / 1000)); // Convert fF to pF for ps result
        const s_out = Math.sqrt(Math.pow(s_in, 2) + Math.pow(delay_rc, 2));
        document.getElementById('slew-out').textContent = s_out.toFixed(1) + ' ps';
    }

    function calculateUnits() {
        const from = document.getElementById('unit-from').value;
        const to = document.getElementById('unit-to').value;
        const val = parseFloat(document.getElementById('unit-val').value) || 0;
        
        const ratios = {
            nm: 1,
            um: 1000,
            mm: 1000000,
            mil: 25400,
            in: 25400000
        };

        const result = (val * ratios[from]) / ratios[to];
        document.getElementById('unit-result').textContent = result.toLocaleString() + ' ' + to;
    }

    function calculateLogicEffort() {
        const F = parseFloat(document.getElementById('eff-f').value) || 1;
        const G = parseFloat(document.getElementById('eff-g').value) || 1;
        const effortSum = F * G;
        const n_opt = Math.max(1, Math.round(Math.log(effortSum) / Math.log(4))); // 4 is typical delay/stage opt
        const f_opt = Math.pow(effortSum, 1/n_opt);
        
        document.getElementById('eff-stage').textContent = f_opt.toFixed(2);
    }

    function updateSignoffStatus() {
        const checks = document.querySelectorAll('.signoff-check');
        const checkedCount = Array.from(checks).filter(c => c.checked).length;
        const statusEl = document.getElementById('signoff-status');
        if (statusEl) {
            if (checkedCount === checks.length) {
                statusEl.textContent = 'READY FOR MASK TAPE-OUT!';
                statusEl.style.color = '#34c759';
            } else {
                statusEl.textContent = 'NOT READY (' + (checks.length - checkedCount) + ' PENDING)';
                statusEl.style.color = '#ff3b30';
            }
        }
        localStorage.setItem('pdx_signoff', checkedCount);
        updateHomeDashboard();
    }

    function updateHomeDashboard() {
        const circle = document.getElementById('dash-circle');
        const text = document.getElementById('dash-pct');
        if (!circle || !text) return;

        const signoff = parseInt(localStorage.getItem('pdx_signoff') || 0);
        const drcSuccess = parseInt(localStorage.getItem('pdx_drc_success') || 0);
        const total = 10; // total milestones
        const pct = Math.min(100, Math.round(((signoff + drcSuccess) / total) * 100));
        
        const offset = 163.36 - (163.36 * pct / 100);
        circle.style.strokeDashoffset = offset;
        text.textContent = pct + '%';
    }

    // DRC Lite Simulator
    window.runDRCSimulation = function() {
        const consoleEl = document.getElementById('drc-console');
        const resultsEl = document.getElementById('drc-results');
        if (!consoleEl) return;

        consoleEl.innerHTML = '[INFO] Starting DRC Verification at 7nm Node...<br>';
        resultsEl.innerHTML = '';

        const logs = [
            'Checking Metal 1 spacing...',
            'Checking Via orientation...',
            'CRITICAL: Metal 2 short detected at [142, 590]',
            'Checking Antenna rules...',
            'LVS Comparison: Netlist Match',
            'Verification Complete. 1 Error found.'
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                consoleEl.innerHTML += `> ${logs[i]}<br>`;
                i++;
                consoleEl.scrollTop = consoleEl.scrollHeight;
            } else {
                clearInterval(interval);
                localStorage.setItem('pdx_drc_success', (parseInt(localStorage.getItem('pdx_drc_success') || 0) + 1));
                updateHomeDashboard();
            }
        }, 800);
    };

    // Logic Propagation
    let isPropagating = false;
    window.propagateSignal = function() {
        if (isPropagating) return;
        isPropagating = true;
        const gateNodes = document.querySelectorAll('.gate-node');
        const wires = document.querySelectorAll('.path-wire');
        const delayVal = document.getElementById('prop-val');
        const statusEl = document.getElementById('prop-status');

        let totalDelay = 0;
        let step = 0;

        const animateStep = () => {
            if (step < gateNodes.length) {
                gateNodes[step].style.boxShadow = '0 0 20px #0071e3';
                gateNodes[step].style.borderColor = '#0071e3';
                totalDelay += 15.5; // dummy delay
                delayVal.innerText = (totalDelay / 10).toFixed(2) + ' ns';
                
                if (step < wires.length) {
                    wires[step].style.width = '40px';
                    wires[step].style.background = '#0071e3';
                }
                
                step++;
                setTimeout(animateStep, 600);
            } else {
                statusEl.innerText = 'FINISHED (1)';
                statusEl.style.color = '#34c759';
                isPropagating = false;
            }
        };
        
        // Reset and start
        gateNodes.forEach(n => { n.style.boxShadow = 'none'; n.style.borderColor = 'var(--border-color)'; });
        wires.forEach(w => { w.style.width = '0'; });
        statusEl.innerText = 'BUSY...';
        statusEl.style.color = '#ff9500';
        animateStep();
    }

    let stageCount = 0;
    function addPathStage() {
        const container = document.getElementById('path-container');
        if (!container) return;
        
        stageCount++;
        const arrow = document.createElement('div');
        arrow.innerHTML = '→';
        arrow.style.cssText = 'color: var(--accent-color); font-weight: bold;';
        
        const stage = document.createElement('div');
        stage.className = 'path-node glass';
        stage.style.cssText = 'min-width: 150px; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid var(--border-color); animation: fadeInUp 0.4s ease-out;';
        
        const delay = (Math.random() * 50 + 20).toFixed(2); // Mock logic delay for visualizer demo
        stage.innerHTML = `
            <div style="font-size:11px; color:var(--text-secondary);">Stage ${stageCount}: Gate</div>
            <div class="stage-delay" style="font-size:18px; font-weight:600;">${delay} ps</div>
            <button class="remove-stage" style="background:none; border:none; color:#ff3b30; cursor:pointer; font-size:10px; margin-top:5px;">[Remove]</button>
        `;
        
        stage.querySelector('.remove-stage').onclick = () => {
            arrow.remove();
            stage.remove();
            updateTotalDelay();
        };
        
        container.appendChild(arrow);
        container.appendChild(stage);
        updateTotalDelay();
    }

    function updateTotalDelay() {
        const delays = document.querySelectorAll('.stage-delay');
        let total = 0;
        delays.forEach(d => total += parseFloat(d.textContent));
        
        const totalEl = document.getElementById('visualizer-total');
        if (totalEl) totalEl.textContent = total.toFixed(2) + ' ps';
        
        const statusEl = document.getElementById('visualizer-status');
        if (statusEl) {
            if (total > 500) { // arbitrary threshold for demo
                statusEl.textContent = 'STATUS: TIMING VIOLATION';
                statusEl.style.color = '#ff3b30';
            } else {
                statusEl.textContent = 'STATUS: WITHIN BUDGET';
                statusEl.style.color = '#34c759';
            }
        }
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

    // --- 7. Interview Simulator Engine ---
    let quizInterval;
    let quizTime = 60;
    let quizScore = 0;
    const questions = [
        { q: "What is the typical utilization target for a floorplan?", a: ["50-70%", "90-100%", "20-30%", "10%"], c: 0 },
        { q: "Which violation cannot be fixed by reducing Frequency?", a: ["Setup", "Hold", "Power", "Area"], c: 1 },
        { q: "What is the main goal of CTS?", a: ["Minimize area", "Minimize skew", "Add logic", "Routing"], c: 1 },
        { q: "Antenna effect is a concern during which stage?", a: ["Synthesis", "Placement", "Routing", "Sign-off"], c: 2 },
        { q: "H-Tree is used to achieve...?", a: ["Power savings", "Balanced Skew", "Area reduction", "Speed"], c: 1 }
    ];

    function startInterviewQuiz() {
        const container = document.getElementById('quiz-sim-container');
        const startBtn = document.getElementById('start-sim');
        if (!container) return;

        container.style.display = 'block';
        startBtn.style.display = 'none';
        quizScore = 0;
        quizTime = 60;
        
        loadNextQuestion(0);
        
        quizInterval = setInterval(() => {
            quizTime--;
            document.getElementById('quiz-timer').textContent = quizTime + 's';
            if (quizTime <= 0) endQuiz();
        }, 1000);
    }

    function loadNextQuestion(idx) {
        if (idx >= questions.length) return endQuiz();
        
        const q = questions[idx];
        document.getElementById('quiz-question').textContent = q.q;
        const optionsEl = document.getElementById('quiz-options');
        optionsEl.innerHTML = '';
        
        q.a.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary glass';
            btn.style.textAlign = 'left';
            btn.textContent = opt;
            btn.onclick = () => {
                if (i === q.c) quizScore++;
                document.getElementById('quiz-score').textContent = `Score: ${quizScore}/5`;
                loadNextQuestion(idx + 1);
            };
            optionsEl.appendChild(btn);
        });
    }

    function endQuiz() {
        clearInterval(quizInterval);
        const container = document.getElementById('quiz-sim-container');
        const level = quizScore >= 4 ? "SIGN-OFF READY" : "PD INTERN GRADE";
        container.innerHTML = `
            <h3 style="color:var(--accent-color)">Simulation Complete!</h3>
            <p style="font-size:24px; margin:20px 0;">Final Score: ${quizScore}/5</p>
            <div style="padding:15px; background:rgba(255,255,255,0.05); border-radius:12px;">
                <span style="font-weight:700">Analysis:</span> ${level}
            </div>
            <button onclick="location.reload()" class="btn btn-primary" style="margin-top:20px;">Retry Simulation</button>
        `;
    }
});
