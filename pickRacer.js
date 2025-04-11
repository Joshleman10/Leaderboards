window.onload = function () {
    const mainButton = document.getElementById("sortButton");
    const initialTopTen = document.getElementById("P1Leaders");
    const secondTopTen = document.getElementById("P2Leaders");
    const minHours = document.getElementById("minHours");
    const resetButton = document.getElementById("resetButton");
    resetButton.onclick = resetAll;

    const trophyIcons = {
        1: "1stplace.png",
        2: "2ndplace.png",
        3: "3rdplace.png"
    };

    let pickerGroupOne = [];
    let pickerGroupTwo = [];
    let firstPickerObj = [];
    let secondPickerObj = [];

    let clicks = 0;

    mainButton.onclick = async function () {
        if (minHours.value === "") {
            minHours.value = 2;
        }

        try {
            const clipboardText = await navigator.clipboard.readText();

            if (!clipboardText.includes("Chewy Labor Management System")) {
                alert("Please ensure clipboard data is from CLMS.");
                return;
            }

            if (!clipboardText) {
                alert("There is no data in your clipboard 😕");
                return;
            }

            let split = clipboardText.split(/\n/);
            let removeStartText = split.slice(21);

            let currentGroup = clicks === 0 ? pickerGroupOne : pickerGroupTwo;
            let currentObj = clicks === 0 ? firstPickerObj : secondPickerObj;

            removeStartText.map((item) => {
                let eachPicker = item.split(/\s+/);
                eachPicker.map((value, index) => {
                    if (index === 0 || index === 1 || index === 4 || index === 6)
                        currentGroup.push(value);
                });
            });

            for (let i = 0; i < currentGroup.length; i += 4) {
                if (i + 3 < currentGroup.length) {
                    const obj = {
                        name: currentGroup[i] + " " + currentGroup[i + 1],
                        hours: currentGroup[i + 2],
                        UPH: currentGroup[i + 3]
                    };
                    currentObj.push(obj);
                }
            }

            let topTen = currentObj
                .filter(picker => parseFloat(picker.hours) >= parseFloat(minHours.value))
                .sort((a, b) => b.UPH - a.UPH)
                .slice(0, 10);

            if (topTen.length < 1) {
                alert("Not enough data. Please adjust hours or check CLMS filters.");
                return;
            }

            topTen = topTen.map((picker, index) => ({
                ...picker,
                rank: index + 1
            }));

            if (clicks === 0) {
                // 🟦 First paste
                topTen.forEach((item) => {
                    const rankClass = `rank-${item.rank <= 3 ? item.rank : ""}`;
                    const trophyImg = trophyIcons[item.rank]
                        ? `<img src="${trophyIcons[item.rank]}" alt="Trophy" style="height: 20px; margin-left: 5px;">`
                        : "";

                    $(initialTopTen).append(`
                        <div class='row mb-2 ${rankClass}'>
                            <div class='col d-flex justify-content-between'>
                                <div><strong>Rank:</strong> ${item.rank}</div>
                                <div><strong>Name:</strong> ${item.name}</div>
                                <div><strong>UPH:</strong> ${item.UPH} ${trophyImg}</div>
                            </div>
                        </div>
                    `);
                });

                mainButton.textContent = "Paste P2 Data";

            } else if (clicks === 1) {

                const firstRankMap = {};
                firstPickerObj
                    .filter(picker => parseFloat(picker.hours) >= parseFloat(minHours.value))
                    .sort((a, b) => b.UPH - a.UPH)
                    .slice(0, 10)
                    .forEach((picker, index) => {
                        firstRankMap[picker.name] = index + 1;
                    });

                topTen.forEach((item) => {
                    const previousRank = firstRankMap[item.name];
                    let movement = '';
                    let movementClass = '';
                    let rankClass = `rank-${item.rank <= 3 ? item.rank : ""}`;
                    const trophyImg = trophyIcons[item.rank]
                        ? `<img src="${trophyIcons[item.rank]}" alt="Trophy" style="height: 20px; margin-left: 5px;">`
                        : "";

                    if (previousRank) {
                        const diff = previousRank - item.rank;
                        if (diff > 0) {
                            movement = `↑${diff}`;
                            movementClass = 'rank-up';
                        } else if (diff < 0) {
                            movement = `↓${Math.abs(diff)}`;
                            movementClass = 'rank-down';
                        } else {
                            movement = '—';
                            movementClass = 'rank-same';
                        }
                    } else {
                        movement = '🆕';
                        movementClass = 'rank-new';
                    }

                    $(secondTopTen).append(`
                        <div class='row mb-2 ${movementClass} ${rankClass}' data-movement="${movementClass}">
                            <div class='col d-flex justify-content-between'>
                                <div><strong>Rank:</strong> ${item.rank}</div>
                                <div><strong>Name:</strong> ${item.name}</div>
                                <div><strong>UPH:</strong> ${item.UPH} ${trophyImg}</div>
                                <div><strong>Movement:</strong> <span class="${movementClass}-text">${movement}</span></div>
                            </div>
                        </div>
                    `);
                });

                // 🔁 Animation repeater
                setInterval(() => {
                    const rows = document.querySelectorAll('#P2Leaders .row[data-movement]');
                    rows.forEach(row => {
                        const movementClass = row.getAttribute('data-movement');
                        row.classList.remove(movementClass);
                        void row.offsetWidth; // Trigger reflow
                        row.classList.add(movementClass);
                    });
                }, 10000);
            }

            clicks++;
        } catch (err) {
            console.error("Clipboard read failed:", err);
            alert("Could not read from clipboard. Make sure the site has clipboard permissions.");
        }
    };

    function resetAll() {
        pickerGroupOne = [];
        pickerGroupTwo = [];
        firstPickerObj = [];
        secondPickerObj = [];
        clicks = 0;
        mainButton.textContent = "Paste P1 Data";
        initialTopTen.innerHTML = "";
        secondTopTen.innerHTML = "";
    }
};