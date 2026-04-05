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
        line.innerHTML = `<span class="prompt">dc_shell></span> ${cmd}`;
        output.appendChild(line);

        const response = document.createElement('div');
        response.className = 'terminal-line';
        response.style.color = '#fff';
        
        const lowerCmd = cmd.toLowerCase();

        switch (true) {
            case lowerCmd.startsWith('help'):
                response.innerHTML = `Available commands: 
                    <br>- read_verilog: Read Verilog source file
                    <br>- compile: Synthesize and optimize design
                    <br>- report_timing: View worst timing paths
                    <br>- report_area: View design area report
                    <br>- clear: Clear terminal output
                    <br>- history: View command history`;
                break;
            
            case lowerCmd.startsWith('read_verilog'):
                isDesignRead = true;
                response.innerHTML = "Reading Verilog file... [OK] <br>Info: Design 'top' loaded successfully.";
                response.style.color = '#34c759';
                break;

            case lowerCmd.startsWith('compile'):
                if (!isDesignRead) {
                    response.innerHTML = "Error: No design loaded. Use 'read_verilog' first.";
                    response.style.color = '#ff3b30';
                } else {
                    isCompiled = true;
                    response.innerHTML = "Running Synthesis Optimization... <br>Mapping logic... <br>Performing Area/Timing trade-offs... <br>Optimization Complete. Design 'top' is ready.";
                }
                break;

            case lowerCmd.startsWith('report_timing'):
                if (!isCompiled) {
                    response.innerHTML = "Warning: Design not compiled. Showing estimated results only.";
                    response.style.color = '#ff9500';
                }
                const slack = (Math.random() * 0.5 - 0.1).toFixed(3);
                response.innerHTML = `--- Worst Path Timing Report ---
                    <br>Startpoint: Reg_A (Rising Clock Edge clk)
                    <br>Endpoint: Reg_B (Rising Clock Edge clk)
                    <br>Path Group: clk
                    <br>Path Type: max
                    <br>---------------------------------
                    <br>Data Path Arrival Time: 0.450 ns
                    <br>Clock Path Required Time: 0.500 ns
                    <br>---------------------------------
                    <br>Slack: ${slack} ns (${slack < 0 ? 'VIOLATED' : 'MET'})`;
                break;

            case lowerCmd.startsWith('report_area'):
                response.innerHTML = `--- Design Area Report ---
                    <br>Combinational Area: 4,520 µm²
                    <br>Non-Combinational Area: 2,120 µm²
                    <br>Total Cell Area: 6,640 µm²`;
                break;

            case lowerCmd === 'clear':
                output.innerHTML = '<div class="terminal-line">Terminal Cleared.</div>';
                return;

            case lowerCmd === 'history':
                response.innerHTML = commandHistory.join('<br>');
                break;

            default:
                response.innerHTML = `Error: Command '${cmd}' not recognized. Type 'help' for support.`;
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
