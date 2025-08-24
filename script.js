// JavaScript to calculate and display the moon phases
document.addEventListener('DOMContentLoaded', () => {
    const datePickerEl = document.getElementById('date-picker');
    const showPhaseBtn = document.getElementById('show-phase-btn');
    const moonDisplaySectionEl = document.getElementById('moon-display-section');
    const phaseHeadingEl = document.getElementById('phase-heading');
    const moonIconMainEl = document.getElementById('moon-icon-main');
    const phaseLabelEl = document.getElementById('phase-label');
    const forecastGridEl = document.getElementById('forecast-grid');

    // New elements for the details section
    const detailsSectionEl = document.getElementById('details-section');
    const detailsDateEl = document.getElementById('details-date');
    const detailsPhaseEl = document.getElementById('details-phase');
    const detailsIlluminationEl = document.getElementById('details-illumination');
    const detailsFactEl = document.getElementById('details-fact');
    
    // Set the date picker to today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    datePickerEl.value = todayString;

    /**
     * Calculates the moon phase and illumination for a given date.
     * This is a simplified algorithm based on the Meeus calculation, suitable for this application.
     * @param {Date} date The date object to calculate the phase for.
     * @returns {{age: number, phase: string, icon: string, illumination: number, fact: string}} An object with moon data.
     */
    function getMoonPhase(date) {
        // A simplified algorithm based on the Meeus calculation
        const knownNewMoon = new Date('2000-01-06T18:14:00Z');
        const msPerDay = 86400000;
        const synodicMonth = 29.53058867;

        const daysSinceKnownNewMoon = (date.getTime() - knownNewMoon.getTime()) / msPerDay;
        const moonAge = (daysSinceKnownNewMoon % synodicMonth + synodicMonth) % synodicMonth;

        // Calculate illumination percentage
        const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * moonAge / synodicMonth)));

        let phase = '';
        let icon = '';
        let fact = '';

        if (moonAge < 1.84) {
            phase = 'New Moon';
            icon = '🌑';
            fact = 'The New Moon is invisible from Earth because it is positioned between the Sun and Earth.';
        } else if (moonAge < 5.53) {
            phase = 'Waxing Crescent';
            icon = '🌒';
            fact = 'A "Waxing" moon is growing in illumination. A Waxing Crescent looks like a thin fingernail in the sky.';
        } else if (moonAge < 9.22) {
            phase = 'First Quarter';
            icon = '🌓';
            fact = 'At the First Quarter, the moon is exactly 50% illuminated, but we see a perfect half circle from Earth.';
        } else if (moonAge < 12.91) {
            phase = 'Waxing Gibbous';
            icon = '🌔';
            fact = 'The Waxing Gibbous phase occurs between a half moon and a full moon, with over half of the moon illuminated.';
        } else if (moonAge < 16.61) {
            phase = 'Full Moon';
            icon = '🌕';
            fact = 'During a Full Moon, the entire face of the moon is illuminated by the Sun, making it appear as a perfect circle.';
        } else if (moonAge < 20.3) {
            phase = 'Waning Gibbous';
            icon = '🌖';
            fact = 'A "Waning" moon is decreasing in illumination. The Waning Gibbous phase occurs just after the full moon.';
        } else if (moonAge < 23.99) {
            phase = 'Last Quarter';
            icon = '🌗';
            fact = 'At the Last Quarter, the other half of the moon is illuminated, but we still see a perfect half circle.';
        } else if (moonAge < 27.68) {
            phase = 'Waning Crescent';
            icon = '🌘';
            fact = 'The Waning Crescent is the last visible phase of the moon before it becomes a New Moon again.';
        } else {
            phase = 'New Moon';
            icon = '🌑';
            fact = 'The New Moon marks the beginning of a new lunar cycle.';
        }

        return { age: moonAge, phase, icon, illumination, fact };
    }

    /**
     * Formats a date string in a readable format (e.g., "Monday, July 22, 2025").
     * @param {Date} date The date object to format.
     * @returns {string} The formatted date string.
     */
    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    /**
     * Renders a single moon phase card on the UI.
     * @param {Date} date The date for the moon phase.
     */
    function renderForecastDay(date) {
        const phaseData = getMoonPhase(date);
        const div = document.createElement('div');
        div.className = `flex flex-col items-center justify-center p-4 rounded-xl bg-gray-700 text-center forecast-card cursor-pointer`;
        
        // Update the click event listener to show the new details section
        div.addEventListener('click', () => {
            detailsDateEl.textContent = formatDate(date);
            detailsPhaseEl.textContent = `Phase: ${phaseData.phase}`;
            detailsIlluminationEl.textContent = `Illumination: ${phaseData.illumination}%`;
            detailsFactEl.textContent = `Did You Know?: ${phaseData.fact}`;
            detailsSectionEl.classList.remove('hidden');
        });

        const iconSpan = document.createElement('span');
        iconSpan.className = `small-moon-icon mb-2`;
        iconSpan.textContent = phaseData.icon;

        const datePara = document.createElement('p');
        datePara.className = `text-sm font-semibold`;
        datePara.textContent = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        const phasePara = document.createElement('p');
        phasePara.className = `text-xs text-gray-400 mt-1`;
        phasePara.textContent = phaseData.phase;

        div.appendChild(iconSpan);
        div.appendChild(datePara);
        div.appendChild(phasePara);

        forecastGridEl.appendChild(div);

        // Add a small delay to animate each card individually
        setTimeout(() => {
            div.style.opacity = '1';
            div.style.transform = 'scale(1)';
        }, 50);
    }

    /**
     * Updates the main display with the moon phase for the selected date.
     */
    function updateDisplay() {
        const selectedDate = new Date(datePickerEl.value);
        const phaseData = getMoonPhase(selectedDate);
        const isToday = selectedDate.toDateString() === today.toDateString();

        phaseHeadingEl.textContent = isToday ? 'Today' : formatDate(selectedDate);
        moonIconMainEl.textContent = phaseData.icon;
        phaseLabelEl.textContent = phaseData.phase;

        moonDisplaySectionEl.classList.remove('hidden');

        // Clear and re-render the 7-day forecast
        forecastGridEl.innerHTML = '';
        for (let i = 1; i <= 7; i++) {
            const nextDay = new Date(selectedDate);
            nextDay.setDate(selectedDate.getDate() + i);
            renderForecastDay(nextDay);
        }

        // Hide the details section when the main display is updated
        detailsSectionEl.classList.add('hidden');
    }

    // Initial render on page load
    updateDisplay();

    // Event listeners
    showPhaseBtn.addEventListener('click', updateDisplay);
    datePickerEl.addEventListener('change', updateDisplay);
});
