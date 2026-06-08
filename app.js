// ==========================================
// 1. STATE CONFIGURATION & INITIALIZATION
// ==========================================
let appState = {
    streak: localStorage.getItem('sajdah_streak') ? parseInt(localStorage.getItem('sajdah_streak')) : 0,
    lastDate: localStorage.getItem('sajdah_last_date') || "",
    journalEntries: JSON.parse(localStorage.getItem('sajdah_journal')) || [],
    selectedMood: ""
};

// Update global UI badges on startup
document.getElementById('streak-count').textContent = appState.streak;

// ==========================================
// 2. SIDEBAR MULTI-VIEW ROUTER
// ==========================================
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Toggle Active Link Style
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Toggle Active View Window
        const targetView = item.getAttribute('data-target');
        viewSections.forEach(view => {
            view.classList.remove('active');
            if(view.id === targetView) view.classList.add('active');
        });

        // Trigger Contextual Re-renders
        if(targetView === 'journal-view') renderJournalFeed();
        if(targetView === 'analytics-view') generateAnalyticsGrid();
    });
});

// ==========================================
// 3. DASHBOARD PROGRESS RING ENGINE
// ==========================================
const checkboxes = document.querySelectorAll('.prayer-checkbox');
const progressText = document.getElementById('progress-text');
const progressRing = document.querySelector('.progress-ring-container');
const progressSummary = document.getElementById('progress-summary');
const submitDayBtn = document.getElementById('submit-day-btn');

function calculateProgress() {
    const totalCheckboxes = checkboxes.length;
    const checkedCount = Array.from(checkboxes).filter(box => box.checked).length;
    const percentage = Math.round((checkedCount / totalCheckboxes) * 100);

    // Render Progress Text strings
    progressText.textContent = `${percentage}%`;
    progressSummary.textContent = `${checkedCount} of ${totalCheckboxes} completed`;

    // Dynamic Updates for Conic Gradient Ring
    progressRing.style.background = `radial-gradient(closest-side, #151c2c 79%, transparent 80% 100%), conic-gradient(#10b981 ${percentage}%, #222d45 ${percentage}% 100%)`;

    // Unlock Actions Conditional Check
    submitDayBtn.disabled = checkedCount !== totalCheckboxes;
}

checkboxes.forEach(box => box.addEventListener('change', calculateProgress));

// Check in Core Trigger Execution
submitDayBtn.addEventListener('click', () => {
    const todayStr = new Date().toDateString();

    if (appState.lastDate === todayStr) {
        alert("You have locked in today's routine already! ✨");
        return;
    }

    // Process Date Calculations for Streaks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (appState.lastDate === yesterday.toDateString() || appState.lastDate === "") {
        appState.streak += 1;
    } else {
        appState.streak = 1;
    }

    // Persist Core Values
    appState.lastDate = todayStr;
    localStorage.setItem('sajdah_streak', appState.streak);
    localStorage.setItem('sajdah_last_date', todayStr);

    document.getElementById('streak-count').textContent = appState.streak;
    alert(`Excellent consistency! Your streak is now ${appState.streak} days. 🔥`);
    
    // Clear Form Progress Checklists safely
    checkboxes.forEach(box => box.checked = false);
    calculateProgress();
});

// ==========================================
// 4. JOURNAL SYSTEM CONTROLLER
// ==========================================
const moodButtons = document.querySelectorAll('.mood-btn');
const journalNotesInput = document.getElementById('journal-notes');
const saveEntryBtn = document.getElementById('save-entry-btn');
const journalFeed = document.getElementById('journal-feed');

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        moodButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        appState.selectedMood = btn.getAttribute('data-mood');
    });
});

saveEntryBtn.addEventListener('click', () => {
    const notesText = journalNotesInput.value.trim();
    if(!notesText) {
        alert("Please jot down some notes before saving.");
        return;
    }

    const newLog = {
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        mood: appState.selectedMood || "Peaceful",
        text: notesText
    };

    appState.journalEntries.unshift(newLog); // Push to front
    localStorage.setItem('sajdah_journal', JSON.stringify(appState.journalEntries));

    // Reset Form Input Layouts
    journalNotesInput.value = "";
    moodButtons.forEach(b => b.classList.remove('selected'));
    appState.selectedMood = "";

    renderJournalFeed();
});

function renderJournalFeed() {
    if (appState.journalEntries.length === 0) {
        journalFeed.innerHTML = `<p class="empty-state">No entries logged yet. Write your first reflection above!</p>`;
        return;
    }

    journalFeed.innerHTML = appState.journalEntries.map(entry => `
        <div class="log-item">
            <div class="log-header">
                <span>${entry.date}</span>
                <span class="log-mood">${entry.mood}</span>
            </div>
            <p class="log-body" style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">${entry.text}</p>
        </div>
    `).join('');
}

// ==========================================
// 5. ANALYTICS ENGINE (MOCK ENGINE GRAPH)
// ==========================================
function generateAnalyticsGrid() {
    const grid = document.getElementById('history-grid');
    grid.innerHTML = ""; // Wipe standard frameworks clean

    // Create 45 dynamic square nodes simulating continuous metrics execution
    for (let i = 0; i < 45; i++) {
        const block = document.createElement('div');
        block.classList.add('grid-square');
        
        // Random assignments to display historical usage beautifully
        if(Math.random() > 0.45 || (i < appState.streak)) {
            block.classList.add('active');
        }
        grid.appendChild(block);
    }
}