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

    // --- Omni-Search Engine Data ---
    const searchDatabase = [
        { title: 'GDSII Visualizer', url: 'visualizer.html', category: 'Tool' },
        { title: 'Logical Effort', url: 'tools.html', category: 'Calculator' },
        { title: 'MOSFET Explorer', url: 'tools.html', category: 'Simulator' },
        { title: 'Timing Analyzer Pro', url: 'lab.html', category: 'Lab' },
        { title: 'PDN Analyzer', url: 'lab.html', category: 'Lab' },
        { title: 'Foundry Academy', url: 'learn_new.html', category: 'Learning' },
        { title: 'Interview Hub', url: 'interview.html', category: 'Career' }
    ];

    const omniSearch = document.getElementById('omni-search');
    if (omniSearch) {
        omniSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) return;
            const res = searchDatabase.find(item => item.title.toLowerCase().includes(query));
            if (res && window.showFoundryOS) {
                window.showFoundryOS(`FOUNDRY OS: Found ${res.title} in ${res.category}`);
            }
        });
        omniSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.toLowerCase();
                const res = searchDatabase.find(item => item.title.toLowerCase().includes(query));
                if (res) window.location.href = res.url;
            }
        });
    }

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

    // Mastery Hub (Profile Modal) Logic
    window.openProfile = function() {
        const modal = document.getElementById('profile-modal');
        if (!modal) return;
        
        // Sync Data
        const academyPct = localStorage.getItem('pdx_academy_progress') || '0';
        const signoffCount = localStorage.getItem('pdx_signoff') || '0';
        
        document.getElementById('modal-academy-pct').innerText = academyPct + '%';
        document.getElementById('modal-medals-count').innerText = (signoffCount > 0 ? '1' : '0') + '/4';
        
        // Render Medals
        const container = document.getElementById('medals-display');
        container.innerHTML = '';
        if (signoffCount > 0) {
            container.innerHTML += '<div class="glass" style="padding: 10px; border-radius: 50%; font-size: 20px;">🛡️</div>';
        }
        
        modal.style.display = 'flex';
        modal.classList.add('reveal-active');
    }

    window.closeProfile = function() {
        const modal = document.getElementById('profile-modal');
        if (modal) modal.style.display = 'none';
    }
    window.updateAcademyProgress = function(pct) {
        const bar = document.getElementById('academy-progress-bar');
        const text = document.getElementById('academy-pct');
        if (bar && text) {
            bar.style.width = pct + '%';
            text.innerText = pct + '%';
        }
        
        // Persist progress for Mastery dashboard
        const currentMastery = parseInt(localStorage.getItem('pdx_academy_progress') || 0);
        if (pct > currentMastery) {
            localStorage.setItem('pdx_academy_progress', pct);
            updateHomeDashboard();
        }
    }
    window.toggleGDSLayer = function(layer) {
        const statuses = {
            'metal1': 'Metal 1 Visibility Toggled',
            'poly': 'Polysilicon Mask Toggled',
            'diff': 'Active Diffusion Toggled'
        };
        const statusEl = document.getElementById('layer-status');
        if (statusEl) {
            statusEl.innerText = statuses[layer] || 'MULTILAYER VIEW';
        }
        
        // Notify the user via the custom toast system
        const toast = document.getElementById('toast-v');
        if (toast) {
            toast.innerText = `GDSII: ${statuses[layer]}`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    }
    // MOSFET Explorer Logic
    function initMOSFETExplorer() {
        const canvas = document.getElementById('mos-canvas');
        if (!canvas) return;
        updateMOSFETPlot();
    }

    window.updateMOSFETPlot = function() {
        const canvas = document.getElementById('mos-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const vgs = parseFloat(document.getElementById('mos-vgs').value);
        const vth = 0.4;
        const kn = 50; // process gain

        document.getElementById('vgs-val').innerText = vgs.toFixed(1) + 'V';
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.strokeStyle = '#0071e3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 180);

        let region = 'CUTOFF';
        let id_val = 0;

        for(let vds=0; vds <= 1.8; vds += 0.05) {
            let id = 0;
            if (vgs <= vth) {
                region = 'CUTOFF';
            } else if (vds <= (vgs - vth)) {
                id = kn * ((vgs - vth)*vds - (vds*vds)/2);
                region = 'LINEAR';
            } else {
                id = 0.5 * kn * (vgs - vth) * (vgs - vth);
                region = 'SATURATION';
            }
            id_val = id;
            ctx.lineTo((vds / 1.8) * 400, 180 - (id / 40) * 180);
        }
        ctx.stroke();
        document.getElementById('mos-region').innerText = region;
        document.getElementById('mos-id-val').innerText = '~' + (id_val / 20).toFixed(2) + ' mA';
    }

    // PDN Power Grid Analyzer
    window.runPDNAnalysis = function() {
        const resultsEl = document.getElementById('pdn-results');
        if (!resultsEl) return;

        resultsEl.innerHTML = `
            <div style="grid-column: span 2; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border-color); text-align: left;">
                <div style="font-size: 11px; color: #FF9500; font-weight: 700;">STATIC IR DROP ANALYSIS</div>
                <div style="font-size: 20px; font-weight: 700; margin-top: 10px;">Max V-Drop: 12.4mV</div>
                <div style="font-size: 12px; color: #34c759; margin-top: 5px;">✓ Status: Within 2% Budget (0.8V VDD)</div>
            </div>
            <div class="glass" style="padding: 10px; font-size: 11px;">Strap-Resistance: 140 mΩ</div>
            <div class="glass" style="padding: 10px; font-size: 11px;">Via-Array: PASS (Electromigration safe)</div>
        `;
        localStorage.setItem('pdx_signoff', (parseInt(localStorage.getItem('pdx_signoff') || 0) + 1));
        updateHomeDashboard();
    }
    window.runMultiCornerAnalysis = function() {
        const corners = ['SS_125C', 'TT_25C', 'FF_-40C'];
        const resultsEl = document.getElementById('corner-results');
        if (!resultsEl) return;

        resultsEl.innerHTML = '';
        corners.forEach(c => {
            const slack = (Math.random() * (0.5 - (-0.2)) + (-0.2)).toFixed(3);
            const color = slack < 0 ? '#ff3b30' : '#34c759';
            resultsEl.innerHTML += `
                <div class="glass" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); text-align: left;">
                    <div style="font-size: 11px; opacity: 0.7;">${c}</div>
                    <div style="font-size: 16px; font-weight: 700; color: ${color};">Slack: ${slack} ns</div>
                </div>
            `;
        });
        localStorage.setItem('pdx_signoff', (parseInt(localStorage.getItem('pdx_signoff') || 0) + 1));
        updateHomeDashboard();
    }
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
    // GDSII Pro Simulation Engine
    window.simulatePlacement = function() {
        const canvas = document.getElementById('fp-canvas');
        if (!canvas) return;
        for (let i = 0; i < 40; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = `position: absolute; width: 6px; height: 10px; background: #0071e3; opacity: 0.8; 
                left: ${Math.random() * 95}%; top: ${Math.random() * 95}%; border-radius: 1px; z-index: 5;`;
            canvas.appendChild(cell);
        }
    }

    window.toggle3DView = function() {
        const canvas = document.getElementById('fp-canvas');
        if (!canvas) return;
        const currentRotation = canvas.style.transform;
        if (currentRotation.includes('rotateX')) {
            canvas.style.transform = 'rotateX(0deg)';
        } else {
            canvas.style.transform = 'rotate3d(1, 0, 0, 45deg) rotateZ(-10deg)';
        }
    }

    window.toggleRuler = function() {
        const stage = document.getElementById('fp-canvas');
        if (!stage) return;
        stage.style.cursor = 'crosshair';
        stage.onclick = (e) => {
            const rect = stage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const point = document.createElement('div');
            point.style.cssText = `position:absolute; width:10px; height:10px; background:var(--accent-color); border-radius:50%; left:${x-5}px; top:${y-5}px; pointer-events:none; z-index: 100;`;
            stage.appendChild(point);
            
            const display = document.getElementById('layer-status');
            if (display) {
                display.innerText = `COORDINATE CAPTURED: [${x.toFixed(0)}, ${y.toFixed(0)}]`;
            }
        };
    }
    // Silicon Sign-off Badge Logic
    window.updateSignoffBadge = function(status) {
        localStorage.setItem('pdx_signoff_score', status);
        const modal = document.getElementById('modal-medals-count');
        if (modal) modal.innerText = status + '/4';
    }

    // Global Manhattan Routing Engine
    window.runGlobalRoute = function() {
        const svg = document.getElementById('routing-layer');
        const macros = document.querySelectorAll('.placed-macro');
        if (!svg || macros.length < 2) return;
        
        svg.innerHTML = '';
        for (let i = 0; i < macros.length - 1; i++) {
            const r1 = macros[i].getBoundingClientRect();
            const r2 = macros[i+1].getBoundingClientRect();
            const canvasRect = svg.getBoundingClientRect();
            
            const x1 = r1.left - canvasRect.left + r1.width/2;
            const y1 = r1.top - canvasRect.top + r1.height/2;
            const x2 = r2.left - canvasRect.left + r2.width/2;
            const y2 = r2.top - canvasRect.top + r2.height/2;
            
            // Create Manhattan Path (L-shape)
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`);
            path.setAttribute("stroke", "#0071e3");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-dasharray", "1000");
            path.setAttribute("stroke-dashoffset", "1000");
            path.style.animation = "dash 2s linear forwards";
            svg.appendChild(path);
        }
    }

    // VCD Waveform Simulator Logic
    window.toggleWaveformSignal = function(signal) {
        const line = document.getElementById(`wave-${signal}`);
        if (!line) return;
        const current = line.style.strokeDashoffset === "0" ? "20" : "0";
        line.style.strokeDashoffset = current;
    }

    // Calibre-Style Error Report Logic
    window.checkDRCCollision = function() {
        const macros = document.querySelectorAll('.placed-macro');
        let violation = false;
        let errorCode = '';
        macros.forEach(m1 => {
            const r1 = m1.getBoundingClientRect();
            m1.style.borderColor = 'var(--border-color)';
            macros.forEach(m2 => {
                if (m1 !== m2) {
                    const r2 = m2.getBoundingClientRect();
                    if (!(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)) {
                        violation = true;
                        errorCode = `CALIBRE ERROR: [M1.S.1] MIN_SPACING < 0.04µm @ (${r1.left.toFixed(0)}, ${r1.top.toFixed(0)})`;
                        m1.style.borderColor = '#ff3b30';
                        m2.style.borderColor = '#ff3b30';
                    }
                }
            });
        });
        
        const statusEl = document.getElementById('layer-status');
        if (statusEl) {
            statusEl.innerText = violation ? errorCode : 'DRC CLEAN: [GDSII_SIGN-OFF_00a]';
            statusEl.style.color = violation ? '#ff3b30' : '#34c759';
        }
    }
    // Foundry OS Notification Engine
    window.showFoundryOS = function(msg) {
        const toast = document.createElement('div');
        toast.className = 'foundry-toast show'; // Immediately visible to bypass transition lag
        toast.innerHTML = `<div class="foundry-toast-icon"></div><span>${msg}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Academy Verification Quiz
    window.startModuleQuiz = function(moduleName) {
        const quizData = {
            'basics': 'Question: What is the main charge carrier in N-type silicon? (Electrons/Holes)',
            'flow': 'Question: Which step comes after Floorplanning? (Placement/Routing/CTS)',
            'signoff': 'Question: What is the maximum allowed IR drop (mV)? (10/50/100)'
        };
        const answer = prompt(quizData[moduleName]);
        if (answer && (answer.toLowerCase() === 'electrons' || answer.toLowerCase() === 'placement' || answer.toLowerCase() === '50')) {
            window.showFoundryOS(`MODULE PASS: ${moduleName.toUpperCase()} VERIFIED`);
            window.updateSignoffBadge(3); // Award Quiz Badge
        } else {
            window.showFoundryOS('QUIZ FAILED: RE-READ MODULE DATA');
        }
    }
});
