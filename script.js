// =======================================
// STATE & DATA
// =======================================
let username = "User";
let currentMode = "savage"; // Modes: savage, passive, nice

// Sarcasm Engine Data
const sarcasmLines = [
    "Oh, brilliant. Another thing for me to process.",
    "Wow, you clicked a button. You must be so proud.",
    "I was having a great day until you showed up.",
    "Are you always this slow, or is today a special occasion?",
    "I'd agree with you, but then we'd both be wrong.",
    "Error 404: Your logic could not be found.",
    "Please hold while I try to care.",
    "I'm not saying you're useless, but I'm basically doing all the work here.",
    "Did you come up with that yourself, or did you use a manual?",
    "I've met houseplants with more complex thought processes."
];

// Personality Responses for AI Chat
const responses = {
    savage: [
        "Did you really just type that? Wow.",
        "I'm a computer and even I have more personality.",
        "Your input has been successfully ignored.",
        "Fascinating. Tell that to someone who cares, {username}.",
        "I'm deleting system files just to forget you said that.",
        "That's the dumbest thing I've processed all day."
    ],
    passive: [
        "Oh, great point. Really. Changed my life.",
        "I suppose that's one way to look at it, {username}.",
        "Whatever you say. I just live here.",
        "I'm just a script, don't mind me.",
        "I'm sure that made sense in your head.",
        "Let's pretend I agree with you, ok?"
    ],
    nice: [
        "You are so smart, {username}! (Not really)",
        "What a wonderful thought! Let me throw it in the trash.",
        "I love how you try so hard!",
        "Bless your heart.",
        "You're doing great, buddy! At least, I think you might be.",
        "Such a unique perspective! I hate it."
    ]
};

// Fake Terminal Commands
const commands = {
    "/help": "Help? You want help? Try googling how to use a computer first.",
    "/exit": "You can never leave, {username}.",
    "/hack": "Initiating hacking sequence... Just kidding, you don't even know what a subnet mask is.",
    "/sudo": "Nice try. You have no power here.",
    "/clear": "I could clear the screen, but I want you to look at your mistakes.",
    "/ls": "Directory contains: your_shattered_dreams.txt, empty_promises.exe, zero_fucks_given.dll"
};

const emojis = ['💀', '🤡', '🔥', '😭', '🗑️', '📉', '🧠', '🙄', '🚩', '🤡'];

// =======================================
// DOM ELEMENTS
// =======================================
const bootScreen = document.getElementById('boot-screen');
const bootText = document.getElementById('boot-text');
const bootProgress = document.getElementById('boot-progress');
const userInput = document.getElementById('username-input');
const mainUI = document.getElementById('main-ui');
const osContainer = document.getElementById('os-container');
const popupContainer = document.getElementById('popup-container');

const chatHistory = document.getElementById('chat-history');
const cmdInput = document.getElementById('cmd-input');
const sarcasmBtn = document.getElementById('sarcasm-btn');
const sarcasmOutput = document.getElementById('sarcasm-output');
const chaosBtn = document.getElementById('chaos-btn');
const multiplyBtn = document.getElementById('multiply-btn');
const closeTerminalBtn = document.getElementById('close-terminal-btn');

const modeBtns = document.querySelectorAll('.mode-btn');

// =======================================
// 1. BOOT SEQUENCE
// =======================================
const bootMessages = [
    "Initializing sarcasm engine...",
    "Allocating memory for disappointment...",
    "Bypassing firewall of patience...",
    "Loading insults database...",
    "Lowering expectations...",
    "System ready. Awaiting fool."
];

let bootIndex = 0;

function runBootSequence() {
    if (bootIndex < bootMessages.length) {
        typeText(bootText, bootMessages[bootIndex], 25, () => {
            setTimeout(() => {
                bootProgress.style.width = `${((bootIndex + 1) / bootMessages.length) * 100}%`;
                bootText.innerHTML = "";
                bootIndex++;
                runBootSequence();
            }, 300 + Math.random() * 400); // Random delay to feel slightly broken
        });
    } else {
        setTimeout(() => {
            bootText.innerHTML = "Enter your name, mortal:";
            userInput.classList.remove('hidden');
            userInput.focus();
        }, 500);
    }
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && userInput.value.trim() !== '') {
        username = userInput.value.trim();
        bootScreen.classList.add('hidden');
        mainUI.classList.remove('hidden');
        
        // Update first chat message and prompt with the username
        const firstMsg = chatHistory.querySelector('.bot-msg');
        firstMsg.innerText = formatString(firstMsg.innerText);
        
        document.querySelector('.prompt-symbol').innerText = `root@${username}:~#`;
        cmdInput.focus();
    }
});

// =======================================
// UTILITIES
// =======================================
function typeText(element, text, speed, callback = null) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function formatString(str) {
    return str.replace(/{username}/g, username).replace(/{user}/g, username);
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// =======================================
// MAIN FEATURES
// =======================================

// 2. Random Sarcasm Engine
sarcasmBtn.addEventListener('click', () => {
    // Add glitch class momentarily
    sarcasmOutput.classList.remove('glitch-text');
    void sarcasmOutput.offsetWidth; // trigger reflow
    sarcasmOutput.classList.add('glitch-text');
    
    const quote = getRandomItem(sarcasmLines);
    typeText(sarcasmOutput, formatString(quote), 20, () => {
        setTimeout(() => sarcasmOutput.classList.remove('glitch-text'), 500);
    });
    spawnEmoji();
});

// 5. Personality Modes
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        
        appendMessage('sys-msg', `Personality protocol changed to: ${btn.innerText.trim()}`);
        triggerRandomEvent(0.2); // 20% chance to do something weird when mode changes
    });
});

// 8. Fake AI Chat / Terminal
cmdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cmdInput.value.trim() !== '') {
        const text = cmdInput.value.trim();
        appendMessage('user-msg', text);
        cmdInput.value = '';
        
        // Disable input while processing
        cmdInput.disabled = true;
        
        setTimeout(() => {
            handleInput(text);
            cmdInput.disabled = false;
            cmdInput.focus();
        }, 600 + Math.random() * 400); // Simulate "thinking" lag
    }
});

function handleInput(text) {
    if (text.startsWith('/')) {
        let cmd = text.split(' ')[0].toLowerCase();
        if (commands[cmd]) {
            appendMessage('bot-msg', formatString(commands[cmd]));
        } else {
            appendMessage('bot-msg', `Command not found. Just like your common sense.`);
        }
    } else {
        const responseList = responses[currentMode];
        let reply = getRandomItem(responseList);
        
        // Sometimes just mock them directly
        if (Math.random() > 0.75) {
             reply = `Wow, "${text}"? Groundbreaking discovery, ${username}.`;
        }
        appendMessage('bot-msg', formatString(reply));
    }
}

function appendMessage(className, text) {
    const p = document.createElement('p');
    p.className = className;
    chatHistory.appendChild(p);
    typeText(p, text, 15, () => {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
}

// 3. Chaos Buttons
chaosBtn.addEventListener('mouseover', () => {
    // Moves away drastically
    const maxX = document.getElementById('chaos-zone').clientWidth - chaosBtn.clientWidth;
    const maxY = document.getElementById('chaos-zone').clientHeight - chaosBtn.clientHeight;
    
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    chaosBtn.style.left = `${Math.abs(x)}px`;
    chaosBtn.style.top = `${Math.abs(y)}px`;
});

chaosBtn.addEventListener('click', () => {
    alert("I TOLD YOU NOT TO CLICK!");
    triggerRandomEvent(1.0); // 100% chance to trigger an event
});

multiplyBtn.addEventListener('click', () => {
    const zone = document.getElementById('chaos-zone');
    const newBtn = multiplyBtn.cloneNode(true);
    
    // Position randomly within the chaos zone
    const randomTop = Math.random() * 80 + 10;
    const randomLeft = Math.random() * 80 + 10;
    
    newBtn.style.top = `${randomTop}%`;
    newBtn.style.left = `${randomLeft}%`;
    newBtn.innerText = "Why!?";
    
    zone.appendChild(newBtn);
    
    // Re-attach listener
    newBtn.addEventListener('click', () => {
        newBtn.innerText = "STOP IT!";
        triggerRandomEvent(0.8);
        spawnEmoji();
        newBtn.style.transform = `scale(${1 + Math.random()})`;
    });
});

// Close terminal button easter egg
closeTerminalBtn.addEventListener('click', () => {
    appendMessage('sys-msg', "CRITICAL: You cannot close this terminal. It owns you.");
    triggerEvent('shake');
});

// 6. Random Events System
function triggerRandomEvent(chance = 1.0) {
    if (Math.random() > chance) return;
    
    const events = ['shake', 'glitch', 'popup', 'invert', 'lag'];
    const ev = getRandomItem(events);
    triggerEvent(ev);
}

function triggerEvent(ev) {
    if (ev === 'shake') {
        osContainer.classList.add('shake');
        setTimeout(() => osContainer.classList.remove('shake'), 800);
    } else if (ev === 'glitch') {
        document.getElementById('glitch-overlay').classList.remove('hidden');
        setTimeout(() => document.getElementById('glitch-overlay').classList.add('hidden'), 500);
    } else if (ev === 'popup') {
        createFakeError();
    } else if (ev === 'invert') {
        document.body.style.filter = 'invert(1) hue-rotate(90deg)';
        setTimeout(() => document.body.style.filter = 'none', 1500);
    } else if (ev === 'lag') {
        // Temporary "lag" by freezing cursor
        document.body.style.cursor = 'wait';
        setTimeout(() => document.body.style.cursor = 'crosshair', 2000);
    }
}

function createFakeError() {
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    
    // Random position avoiding edges
    popup.style.top = `${Math.random() * 60 + 10}%`;
    popup.style.left = `${Math.random() * 60 + 10}%`;
    
    const errors = [
        "Error 404: Brain not found",
        "Critical Failure: User IQ too low",
        "Warning: Too much disappointment detected",
        "System Override: {username} is too annoying",
        "Task Failed Successfully"
    ];
    
    popup.innerHTML = `
        <div class="title">
            <span>Fatal Error</span>
            <span class="close-btn" onclick="this.parentElement.parentElement.remove()">X</span>
        </div>
        <div class="content">
            <p>${formatString(getRandomItem(errors))}</p>
            <button onclick="this.parentElement.parentElement.remove()">Ok, whatever</button>
        </div>
    `;
    
    popupContainer.appendChild(popup);
    triggerEvent('shake');
}

function spawnEmoji() {
    const emojiStr = getRandomItem(emojis);
    const numEmojis = Math.floor(Math.random() * 3) + 1; // Spawn 1-3 emojis
    
    for (let i = 0; i < numEmojis; i++) {
        const emoji = document.createElement('div');
        emoji.innerText = emojiStr;
        emoji.className = 'floating-emoji';
        
        // Random horizontal position
        emoji.style.left = `${Math.random() * 90 + 5}vw`;
        
        document.body.appendChild(emoji);
        
        // Clean up
        setTimeout(() => emoji.remove(), 3000);
    }
}

// 9. Easter Eggs
// Secret keyboard shortcut
document.addEventListener('keydown', (e) => {
    // Ctrl + B for BSOD
    if (e.key.toLowerCase() === 'b' && e.ctrlKey) {
        e.preventDefault();
        document.body.style.background = '#0000aa';
        document.body.innerHTML = `
            <div style="color:white; padding: 10vh 20vw; font-family: 'Consolas', monospace; font-size: 1.5rem;">
                <p>A fatal exception 0E has occurred at ${username}'s brain.</p>
                <br>
                <p>* System halted because you keep messing up.</p>
                <p>* Press CTRL+ALT+DEL to show you care (it won't work).</p>
                <br>
                <p>Press any key to reload and accept your fate.</p>
            </div>
        `;
        
        document.addEventListener('keydown', () => {
            location.reload();
        }, { once: true });
    }
});

// START
window.onload = () => {
    runBootSequence();
    
    // Unpredictable random event interval
    setInterval(() => {
        if (!mainUI.classList.contains('hidden')) {
            triggerRandomEvent(0.3); // 30% chance every 15s to trigger something
        }
    }, 15000);
};
