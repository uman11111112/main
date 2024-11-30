// Get references to form elements
const alarmForm = document.getElementById('alarmForm');
const alarmBody = document.getElementById('alarmBody');

// Load alarms from local storage
function loadAlarms() {
    return JSON.parse(localStorage.getItem('alarms')) || [];
}

// Save alarms to local storage
function saveAlarms(alarms) {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// Create a table row for each alarm
function createAlarmRow(alarm, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${new Date(alarm.time).toLocaleString()}</td>
        <td>${alarm.message}</td>
        <td><input type="checkbox" ${alarm.active ? 'checked' : ''} data-index="${index}" class="status-toggle"></td>
        <td>
            <button data-index="${index}" class="snooze-button snooze-btn">Snooze</button>
            <button data-index="${index}" class="stop-button stop-btn">Stop</button>
            <button data-index="${index}" class="delete-button">Delete</button>
        </td>
    `;
    return row;
}

// Display alarms in the table
function displayAlarms() {
    alarmBody.innerHTML = '';
    const alarms = loadAlarms();
    alarms.forEach((alarm, index) => {
        const row = createAlarmRow(alarm, index);
        alarmBody.appendChild(row);
    });
}

// Check alarms and handle notifications
function checkAlarms() {
    const alarms = loadAlarms();
    const now = new Date().getTime();

    alarms.forEach((alarm, index) => {
        if (alarm.active && new Date(alarm.time).getTime() <= now) {
            alert(`Alarm: ${alarm.message}`);

            // Turn off the alarm after the time has passed
            alarm.active = false;
            saveAlarms(alarms);
            displayAlarms(); // Update table
        }
    });
}

// Set interval to check alarms every minute
setInterval(checkAlarms, 60000);

// Handle form submission
alarmForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const time = document.getElementById('time').value;
    const message = document.getElementById('message').value;

    const alarms = loadAlarms();
    alarms.push({ time: time, message: message, active: true });
    saveAlarms(alarms);

    displayAlarms();
    alert('Alarm set successfully!');
});

// Handle status toggle, snooze, stop, and delete actions
alarmBody.addEventListener('change', function (event) {
    if (event.target.classList.contains('status-toggle')) {
        const index = event.target.getAttribute('data-index');
        const alarms = loadAlarms();
        alarms[index].active = event.target.checked;
        saveAlarms(alarms);
    }
});

alarmBody.addEventListener('click', function (event) {
    if (event.target.classList.contains('snooze-button')) {
        const index = event.target.getAttribute('data-index');
        const alarms = loadAlarms();
        alarms[index].time = new Date(new Date().getTime() + 5 * 60000).toISOString(); // Snooze for 5 minutes
        alarms[index].active = false; // Deactivate alarm until snooze time
        saveAlarms(alarms);
        displayAlarms();
    }

    if (event.target.classList.contains('stop-button')) {
        const index = event.target.getAttribute('data-index');
        const alarms = loadAlarms();
        alarms[index].active = false;
        saveAlarms(alarms);
        displayAlarms();
    }

    if (event.target.classList.contains('delete-button')) {
        const index = event.target.getAttribute('data-index');
        const alarms = loadAlarms();
        alarms.splice(index, 1);
        saveAlarms(alarms);
        displayAlarms();
    }
});

// Initial display
displayAlarms();
