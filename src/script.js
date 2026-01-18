(function () {
    const vscode = acquireVsCodeApi();

    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const wheelInner = document.querySelector('.wheel-inner');
    const resultDisplay = document.getElementById('result-display');
    const wheelOptionsInput = document.getElementById('wheel-options');
    const commandArea = document.getElementById('command-area');
    const validationMsg = document.getElementById('validation-msg');

    let options = [];

    function generateColor(existingOptions = []) {
        const usedHues = existingOptions.map(p => {
            const match = p.color.match(/hsl\((\d+)/);
            return match ? parseInt(match[1]) : -1;
        }).filter(h => h !== -1);

        let hue;
        let attempts = 0;
        let isDistinct = false;
        const minDiff = 35;

        while (!isDistinct && attempts < 200) {
            hue = Math.floor(Math.random() * 360);

            const conflict = usedHues.some(usedHue => {
                const diff = Math.abs(hue - usedHue);
                const wrappedDiff = Math.min(diff, 360 - diff);
                return wrappedDiff < minDiff;
            });

            if (!conflict) {
                isDistinct = true;
            }
            attempts++;
        }

        if (hue === undefined) hue = Math.floor(Math.random() * 360);

        return `hsl(${hue}, 85%, 55%)`;
    }

    let currentRotation = 0;
    let validConfig = true;

    function parseInput() {
        const rawInput = wheelOptionsInput.value;
        let inputValues = rawInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

        const uniqueValues = [];
        const seen = new Set();

        inputValues.forEach(opt => {
            const lower = opt.toLocaleLowerCase();
            if (!seen.has(lower)) {
                seen.add(lower);
                uniqueValues.push(opt);
            }
        });
        inputValues = uniqueValues;

        if (inputValues.length < 2) {
            setValidationState(false, "Add at least 2 options");
            return;
        }

        if (inputValues.length > 20) {
            setValidationState(false, "Max 20 options allowed");
            return;
        }

        setValidationState(true);

        const newOptions = [];
        const pool = options.slice();

        inputValues.forEach(label => {
            const existing = pool.find(p => p.label === label);
            if (existing) {
                newOptions.push(existing);
            } else {
                const color = generateColor(pool);
                const opt = { label: label, color };
                newOptions.push(opt);
                pool.push(opt);
            }
        });

        options = newOptions;
        renderWheel();
    }

    function setValidationState(isValid, msg = "") {
        validConfig = isValid;
        spinBtn.disabled = !isValid;
        validationMsg.textContent = msg;
        if (!isValid) {
            validationMsg.classList.add('error');
        } else {
            validationMsg.classList.remove('error');
        }
    }

    function renderWheel() {
        if (!validConfig || options.length === 0) return;

        wheelInner.innerHTML = '';

        const segmentAngle = 360 / options.length;
        let gradientParts = [];

        options.forEach((option, index) => {
            const color = option.color;

            const startPercent = (index / options.length) * 100;
            const endPercent = ((index + 1) / options.length) * 100;
            gradientParts.push(`${color} ${startPercent}% ${endPercent}%`);

            const angle = (index * segmentAngle) + (segmentAngle / 2);

            const labelContainer = document.createElement('div');
            labelContainer.className = 'label';

            labelContainer.style.transform = `rotate(${angle - 90}deg)`;

            const span = document.createElement('span');
            span.textContent = option.label;
            labelContainer.appendChild(span);

            wheelInner.appendChild(labelContainer);
        });

        wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    }

    function spin() {
        if (!validConfig) return;

        spinBtn.disabled = true;
        wheelOptionsInput.disabled = true;
        resultDisplay.classList.remove('show');
        resultDisplay.textContent = '';

        const randomDegrees = Math.floor(Math.random() * 360);
        const extraSpins = 360 * 5;
        const totalSpin = extraSpins + randomDegrees;

        currentRotation += totalSpin;
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            const actualRotation = currentRotation % 360;
            const degreesAtPointer = (360 - actualRotation) % 360;

            const segmentAngle = 360 / options.length;
            const winningIndex = Math.floor(degreesAtPointer / segmentAngle);
            const wonOption = options[winningIndex];

            showResult(wonOption);
            spinBtn.disabled = false;
            wheelOptionsInput.disabled = false;

            vscode.postMessage({
                command: 'spinResult',
                result: wonOption ? wonOption.label : null,
                commandText: commandArea ? commandArea.value : null
            });
        }, 5000);
    }

    function showResult(option) {
        if (option) {
            resultDisplay.textContent = option.label;
            resultDisplay.classList.add('show');
        }
    }

    spinBtn.addEventListener('click', spin);
    wheelOptionsInput.addEventListener('input', parseInput);

    // init state
    setValidationState(false, 'Add at least 2 options');
})();
