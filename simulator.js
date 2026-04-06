document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    
    let currentPath = '/home/user';
    let fileSystem = {
        '/home/user': ['design.v', 'netlist.v', 'constraints.sdc', 'tech_lib/'],
        '/home/user/tech_lib': ['std_cells.db', 'macros.db']
    };
    let commandHistory = [];
    let isVLSIMode = false; // For shell-within-shell experience if needed

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const val = input.value.trim();
                if (val) {
                    processLinuxCommand(val);
                    input.value = '';
                }
            }
        });
    }

    function processLinuxCommand(cmd) {
        // Log the command line
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span style="color: #00ff00; font-weight: bold;">user@pdxhub:</span><span style="color: #34c759;">${currentPath.replace('/home/user', '~')}</span>$ ${cmd}`;
        output.appendChild(line);

        const response = document.createElement('div');
        response.className = 'terminal-line';
        response.style.paddingLeft = '15px';
        response.style.color = '#00ff00';
        response.style.opacity = '0.9';
        
        const lowerCmd = cmd.toLowerCase();
        const args = lowerCmd.split(' ');
        const base = args[0];

        switch (base) {
            case 'help':
                response.innerHTML = `
                    <div style="color: #00ff00; font-weight: bold; margin-bottom: 5px;">--- PDX HUB TERMINAL HELP ---</div>
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 5px; font-size: 13px;">
                        <span style="color: #fff;">ls</span> <span>List design files and folders</span>
                        <span style="color: #fff;">cd [dir]</span> <span>Change directory</span>
                        <span style="color: #fff;">pwd</span> <span>Print current working directory</span>
                        <span style="color: #fff;">cat [file]</span> <span>View content of VLSI files</span>
                        <span style="color: #fff;">mkdir [dir]</span> <span>Create a new project folder</span>
                        <span style="color: #fff;">dc_shell</span> <span>Launch Design Compiler Simulator</span>
                        <span style="color: #fff;">run_drc</span> <span>Execute Design Rule Checks</span>
                        <span style="color: #fff;">report_timing</span> <span>Quick STA analysis check</span>
                        <span style="color: #fff;">clear</span> <span>Clear terminal history</span>
                    </div>`;
                break;

            case 'ls':
                const items = fileSystem[currentPath] || [];
                response.innerHTML = items.map(i => {
                    const isDir = i.endsWith('/');
                    return `<span style="color: ${isDir ? '#5856D6' : '#00ff00'}; margin-right: 15px;">${i}</span>`;
                }).join('');
                break;

            case 'pwd':
                response.innerHTML = currentPath;
                break;

            case 'clear':
                output.innerHTML = '<div class="terminal-line" style="color: #00ff00; opacity: 0.5;">Terminal history cleared.</div>';
                return;

            case 'cd':
                const target = args[1];
                if (!target || target === '~') {
                    currentPath = '/home/user';
                } else if (target === '..') {
                    if (currentPath !== '/home/user') currentPath = '/home/user';
                } else if (fileSystem[currentPath + '/' + target.replace('/', '')]) {
                    currentPath += '/' + target.replace('/', '');
                } else {
                    response.innerHTML = `cd: no such directory: ${target}`;
                    response.style.color = '#ff3b30';
                }
                break;

            case 'mkdir':
                const newDir = args[1];
                if (newDir) {
                    fileSystem[currentPath].push(newDir + '/');
                    fileSystem[currentPath + '/' + newDir] = [];
                    response.innerHTML = `Directory '${newDir}' created successfully.`;
                }
                break;

            case 'cat':
                const file = args[1];
                if (file === 'design.v') {
                    response.innerHTML = `<pre style="color: #fff; font-size: 11px;">module top(clk, rst, d, q);<br>  input clk, rst, d;<br>  output reg q;<br>  always @(posedge clk or posedge rst) begin<br>    if (rst) q <= 0;<br>    else q <= d;<br>  end<br>endmodule</pre>`;
                } else if (file === 'constraints.sdc') {
                    response.innerHTML = `<pre style="color: #fff; font-size: 11px;">create_clock -name clk -period 1.0 [get_ports clk]<br>set_clock_uncertainty 0.05 [get_clocks clk]<br>set_input_delay 0.2 -clock clk [get_ports d]</pre>`;
                } else {
                    response.innerHTML = `cat: ${file || 'file'}: No such file or directory`;
                    response.style.color = '#ff3b30';
                }
                break;

            case 'dc_shell':
                response.innerHTML = "Initializing Synopsys Design Compiler (Sim)... <br>[SUCCESS] dc_shell mode active. Type 'help' for synthesis commands.";
                response.style.color = '#fff';
                break;

            case 'run_drc':
                response.innerHTML = "Loading 7nm Foundry Rules... <br>Checking density... [OK] <br>Checking spacing... [OK] <br>[FINISH] 0 Violations found.";
                response.style.color = '#34c759';
                break;

            case 'report_timing':
                response.innerHTML = `
                    <div style="color: #fff; border: 1px solid #333; padding: 10px; margin-top: 5px;">
                        Path Type: Setup Slack (Max)<br>
                        Endpoint: REG_Q/D (rising edge-triggered)<br>
                        Slack: +0.540 ns (MET)
                    </div>`;
                break;

            default:
                response.innerHTML = `-pdxhub: ${base}: command not found`;
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
