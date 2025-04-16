window.onload = function () {
    const mainButton = document.getElementById("sortButton");
    const initialTopTen = document.getElementById("P1Leaders");
    const secondTopTen = document.getElementById("P2Leaders");
    const mostImprovedDiv = document.getElementById("MostImproved");
    const minHours = document.getElementById("minHours");
    const resetButton = document.getElementById("resetButton");
    const toggleCompactBtn = document.getElementById("toggleCompact");

    const rankEmojis = {
        1: "🏆",
        2: "🥈",
        3: "🥉"
    };

    resetButton.onclick = resetAll;

    let pickerGroupOne = [], pickerGroupTwo = [], firstPickerObj = [], secondPickerObj = [];
    let clicks = 0;

    // Create and insert the footer once
    const infoFooter = document.createElement('div');
    infoFooter.id = "infoFooter";
    infoFooter.classList.add('mt-4');
    mostImprovedDiv.parentElement.appendChild(infoFooter); // Aligns under both tables

    const updateInfoFooter = () => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        infoFooter.innerHTML = `
            <div class="fst-italic text-muted mb-2">Information updated at: ${formattedTime}</div>
            <div class="symbol-key">
                <strong>Symbol Key:</strong>
                <ul class="small ps-3 mb-0">
                    <li>🏆 / 🥈 / 🥉 – Top 3 performers</li>
                    <li>↑ / ↓ – Change in position since previous data</li>
                    <li>🚀 – Improvement or upward movement</li>
                    <li>New – Newly ranked</li>
                </ul>
            </div>
        `;
    };

    const renderTableHeader = (parent) => {
        const header = document.createElement('div');
        header.classList.add('row', 'fw-bold', 'text-uppercase');

        let uphLabel = "UPH";
        if (parent === mostImprovedDiv) {
            uphLabel = "Change";
        }

        header.innerHTML = `
            <div class="col">Rank</div>
            <div class="col">Name</div>
            <div class="col">${uphLabel}</div>
            ${parent === secondTopTen ? '<div class="col">Movement</div>' : ''}
        `;
        parent.appendChild(header);
    };

    mainButton.onclick = async function () {
        if (minHours.value === "") minHours.value = 2;

        try {
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText.includes("Chewy Labor Management System")) {
                alert("Please ensure clipboard data is from CLMS.");
                return;
            }

            let split = clipboardText.split(/\n/).slice(21);
            let currentGroup = clicks === 0 ? pickerGroupOne : pickerGroupTwo;
            let currentObj = clicks === 0 ? firstPickerObj : secondPickerObj;

            split.forEach(item => {
                let each = item.split(/\s+/);
                if (each.length >= 7) {
                    currentGroup.push({
                        name: `${each[0]} ${each[1]}`,
                        hours: each[4],
                        UPH: each[6]
                    });
                }
            });

            currentGroup.forEach(p => {
                if (parseFloat(p.hours) >= parseFloat(minHours.value)) currentObj.push(p);
            });

            currentObj.sort((a, b) => b.UPH - a.UPH);
            const topTen = currentObj.slice(0, 10).map((p, i) => ({ ...p, rank: i + 1 }));

            if (clicks === 0) {
                renderTableHeader(initialTopTen);
                topTen.forEach(p => {
                    const rankClass = `rank-${p.rank <= 3 ? p.rank : ""}`;
                    $(initialTopTen).append(`
                        <div class='row mb-2 ${rankClass}'>
                            <div class='col'>${p.rank}</div>
                            <div class='col'>${p.name}</div>
                            <div class='col'>${p.UPH}</div>
                        </div>
                    `);
                });
                mainButton.textContent = "Paste Current Data";
                updateInfoFooter(); // Show timestamp + key on first paste
            } else {
                renderTableHeader(secondTopTen);

                const previousRanks = {};
                firstPickerObj.forEach((p, i) => {
                    previousRanks[p.name] = i + 1;
                });

                const allP2 = [...secondPickerObj].sort((a, b) => b.UPH - a.UPH);
                const allP1 = [...firstPickerObj].sort((a, b) => b.UPH - a.UPH);

                const movementData = allP2.map((p, index) => {
                    const prevIndex = allP1.findIndex(x => x.name === p.name);
                    const movement = prevIndex === -1 ? null : prevIndex - index;
                    return {
                        ...p,
                        rank: index + 1,
                        movement: movement
                    };
                });

                const improved = movementData
                    .filter(m => m.movement > 0)
                    .sort((a, b) => b.movement - a.movement)
                    .slice(0, 5);

                movementData.slice(0, 10).forEach(p => {
                    let movementText = '—', movementClass = 'rank-same';
                    if (p.movement > 0) {
                        movementText = `↑${p.movement}`;
                        movementClass = 'rank-up';
                    } else if (p.movement < 0) {
                        movementText = `↓${Math.abs(p.movement)}`;
                        movementClass = 'rank-down';
                    } else if (p.movement === null) {
                        movementText = 'New';
                        movementClass = 'rank-new';
                    }

                    const rankClass = `rank-${p.rank <= 3 ? p.rank : ""}`;
                    const showEmojiOnly = p.rank <= 3;
                    const rankDisplay = showEmojiOnly ? `${rankEmojis[p.rank]}` : p.rank;
                    const rocketEmoji = p.movement > 0 ? ' 🚀' : '';

                    const isTop3 = p.rank <= 3;
                    const textColorClass = isTop3 ? 'black-text' : '';
                    const movementTextColorClass = isTop3 ? 'black-text' : `${movementClass}-text`;

                    $(secondTopTen).append(`
                        <div class='row mb-2 ${rankClass} ${movementClass} ${textColorClass}'>
                            <div class='col'>${rankDisplay}${rocketEmoji}</div>
                            <div class='col'>${p.name}</div>
                            <div class='col'>${p.UPH}</div>
                            <div class='col'>
                                <span class="${movementTextColorClass}">${movementText}</span>
                            </div>
                        </div>
                    `);
                });

                const UPHMapP1 = {};
                firstPickerObj.forEach(p => {
                    UPHMapP1[p.name] = parseFloat(p.UPH);
                });

                const improvementData = secondPickerObj
                    .filter(p => UPHMapP1[p.name] && parseFloat(UPHMapP1[p.name]) > 0)
                    .map(p => {
                        const oldUPH = UPHMapP1[p.name];
                        const newUPH = parseFloat(p.UPH);
                        const changePercent = ((newUPH - oldUPH) / oldUPH) * 100;
                        const changeUPH = newUPH - oldUPH;
                        return {
                            ...p,
                            improvementPercent: changePercent,
                            changeUPH: changeUPH
                        };
                    })
                    .filter(p => p.improvementPercent > 0)
                    .sort((a, b) => b.improvementPercent - a.improvementPercent)
                    .slice(0, 5);

                renderTableHeader(mostImprovedDiv);
                improvementData.forEach((p, index) => {
                    $(mostImprovedDiv).append(`
                        <div class='row mb-2'>
                            <div class='col'>${index + 1} 🚀</div>
                            <div class='col'>${p.name}</div>
                            <div class='col'>${p.improvementPercent.toFixed(1)}% (${p.changeUPH.toFixed(1)})</div>
                        </div>
                    `);
                });

                updateInfoFooter(); // Show timestamp + key on second paste
            }

            clicks++;
            if (clicks === 2) {
                mainButton.style.display = "none";
            }
        } catch (err) {
            console.error("Clipboard read failed:", err);
            alert("Clipboard read failed. Please allow permission.");
        }
    };

    toggleCompactBtn.onclick = function () {
        document.body.classList.toggle("compact-mode");
        toggleCompactBtn.textContent = document.body.classList.contains("compact-mode")
            ? "Standard View"
            : "Compact View";
    };

    function resetAll() {
        location.reload();
    }
};
