document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    
    let isDesignRead = false;
    let isCompiled = false;
    let commandHistory = [];

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const val = input.value.trim();
                if (val) {
                    processCommand(val);
                    input.value = '';
                }
            }
        });
    }

    function processCommand(cmd) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt" style="color: var(--accent-color); font-weight: bold;">dc_shell></span> ${cmd}`;
        output.appendChild(line);

        const response = document.createElement('div');
        response.className = 'terminal-line';
        response.style.paddingLeft = '20px';
        response.style.color = '#ccc';
        
        const lowerCmd = cmd.toLowerCase();
        const parts = lowerCmd.split(' ');
        const baseCmd = parts[0];

        switch (baseCmd) {
            case 'help':
                response.innerHTML = `
                    <div style="color: var(--accent-color); font-weight: bold; margin-bottom: 5px;">--- DESIGN COMPILER COMMANDS HELPER ---</div>
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
                        <span>read_verilog</span> <span>Read RTL source files</span>
                        <span>link</span> <span>Resolve design references</span>
                        <span>check_design</span> <span>Sanity check for connectivity</span>
                        <span>set_clock</span> <span>Define clock period/uncertainty</span>
                        <span>compile</span> <span>Synthesize & Optimize logic</span>
                        <span>report_timing</span> <span>Full path timing analysis</span>
                        <span>report_area</span> <span>Silicon area & gate count</span>
                        <span>report_power</span> <span>Power (Switching/Leakage)</span>
                        <span>report_constraint</span> <span>Worst Violations Summary</span>
                        <span>write</span> <span>Save netlist (Verilog/DB)</span>
                        <span>clear</span> <span>Clear terminal buffer</span>
                    </div>`;
                break;
            
            case 'read_verilog':
                isDesignRead = true;
                response.innerHTML = `Reading Verilog file... [OK]<br>Successfully read design 'top' from ${parts[1] || 'design.v'}`;
                response.style.color = '#34c759';
                break;

            case 'link':
                if (!isDesignRead) {
                    response.innerHTML = "Error: No design read. Use 'read_verilog' first.";
                    response.style.color = '#ff3b30';
                } else {
                    response.innerHTML = "Linking design 'top' to library tech_7nm... [OK]";
                    response.style.color = '#34c759';
                }
                break;

            case 'check_design':
                if (!isDesignRead) {
                    response.innerHTML = "Error: No design to check.";
                    response.style.color = '#ff3b30';
                } else {
                    response.innerHTML = "Checking design 'top'...<br>[INFO] No floating pins found.<br>[INFO] Connectivity check passed.";
                    response.style.color = '#34c759';
                }
                break;

            case 'set_clock':
            case 'set_clock_uncertainty':
            case 'set_clock_jitter':
                response.innerHTML = `Applied constraint to clock 'clk': ${parts.slice(1).join(' ') || 'default'}`;
                response.style.color = '#5856D6';
                break;

            case 'compile':
            case 'compile_ultra':
                if (!isDesignRead) {
                    response.innerHTML = "Error: No design loaded. Use 'read_verilog' first.";
                    response.style.color = '#ff3b30';
                } else {
                    isCompiled = true;
                    response.innerHTML = "Running Synthesis Optimization Flow...<br>[1] Loading Tech Library (7nm)...<br>[2] Mapping GTECH to Gates...<br>[3] Optimizing for Slack & Leakage...<br>Synthesis Successful. Design 'top' is mapped.";
                    response.style.color = '#34c759';
                }
                break;

            case 'report_timing':
                if (!isCompiled) {
                    response.innerHTML = "Warning: Design not compiled. Showing pre-synthesis estimates.";
                    response.style.color = '#ff9500';
                }
                const slack = (Math.random() * 0.5 - 0.1).toFixed(3);
                response.innerHTML = `
                    <pre style="font-family: inherit; margin: 0; line-height: 1.2;">
****************************************
Report : timing
        -path full
        -delay max
        -max_paths 1
Design : top
Version: S-2026.PD-H
****************************************
Startpoint: REG_A (rising edge-triggered flip-flop)
Endpoint: REG_B (rising edge-triggered flip-flop)
Path Type: max

  Point                                    Incr       Path
  -----------------------------------------------------------
  clock clk (rise edge)                   0.00       0.00
  clock source latency                    0.05       0.05
  REG_A/CP (DFF_X1)                       0.00       0.05 r
  REG_A/Q (DFF_X1)                        0.15       0.20 f
  U12/Z (NAND2_X1)                        0.12       0.32 r
  U45/Z (OR2_X1)                          0.11       0.43 f
  REG_B/D (DFF_X1)                        0.02       0.45 f
  data arrival time                                  0.45

  clock clk (rise edge)                   1.00       1.00
  clock network delay (ideal)             0.00       1.00
  REG_B/CP (DFF_X1)                                  1.00 r
  library setup time                     -0.05       0.95
  data required time                                 0.95
  -----------------------------------------------------------
  data required time                                 0.95
  data arrival time                                 -0.45
  -----------------------------------------------------------
  slack (MET)                                        0.50
                    </pre>`;
                break;

            case 'report_area':
                response.innerHTML = `
                    <pre style="font-family: inherit; margin: 0;">
****************************************
Report : area
Design : top
****************************************
Library(s) Used: tech_7nm
Number of ports: 42
Number of nets: 1420
Number of cells: 840
Total Cell Area: 664.20 µm²
Hierarchical Area: 420.50 µm²
                    </pre>`;
                break;

            case 'report_power':
                response.innerHTML = `
                    <pre style="font-family: inherit; margin: 0;">
****************************************
Report : power
Design : top
****************************************
Switching Power: 142.4 µW  (62%)
Internal Power:  58.2 µW   (25%)
Leakage Power:   28.5 µW   (13%)
Total Power:     229.1 µW
                    </pre>`;
                break;

            case 'report_constraint':
                response.innerHTML = `
                    <pre style="font-family: inherit; margin: 0;">
****************************************
Report : constraint
Design : top
****************************************
Critical Path Slack:  0.500 (MET)
Max Capacitance:      0.005 (MET)
Max Transition:       0.010 (MET)
Max Fanout:           UNCONSTRAINED
                    </pre>`;
                break;

            case 'ls':
                response.innerHTML = "design.v  constraints.sdc  tech_7nm.db  reports/ scripts/";
                break;

            case 'pwd':
                response.innerHTML = "/home/pdx_engineer/foundry/top_design";
                break;

            case 'clear':
                output.innerHTML = '<div class="terminal-line" style="color: var(--text-secondary); font-style: italic;">Terminal buffer cleared. DC Shell [Foundry v2.7] ready.</div>';
                return;

            case 'history':
                response.innerHTML = commandHistory.length ? commandHistory.join('<br>') : "No command history.";
                break;

            case 'exit':
            case 'quit':
                response.innerHTML = "Terminating DC Shell session... Goodbye!";
                response.style.color = '#ff9500';
                setTimeout(() => location.reload(), 1500);
                break;

            default:
                response.innerHTML = `Error: Command '${cmd}' is not a valid dc_shell or unix command. Type 'help' for instructions.`;
                response.style.color = '#ff3b30';
        }

        commandHistory.push(cmd);
        output.appendChild(response);
        output.scrollTop = output.scrollHeight;
    }

    // Cheat Sheet Filter
    const search = document.getElementById('search-cmds');
    if (search) {
        search.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            document.querySelectorAll('.cheat-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(val) ? 'block' : 'none';
            });
        });
    }
});
