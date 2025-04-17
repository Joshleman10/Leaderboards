# MultisLeaderboards
Tool to generate multis leaderboards and drive buy in amongst multis pickers.

---

## 📊 CLMS Performance Dashboard — README

### Overview

This tool provides a side-by-side performance comparison for team members (TMs) using data copied from the **Chewy Labor Management System (CLMS)**. It highlights:

- Top 10 performers by UPH
- Changes in ranking over time
- Most improved team members
- Rank-based icons and visual cues
- Timestamped updates and a helpful symbol key

---

### 🛠 How It Works

1. **Initial Setup**: On page load, all buttons and containers are wired for interactivity.
2. **First Paste (P1)**:
   - User pastes CLMS data (copied to clipboard).
   - Filters out entries under a specified `minHours` (default is 2 hours).
   - Displays **Top 10 Performers** with their rank, name, and UPH.
3. **Second Paste (P2)**:
   - Compares new data with the previous.
   - Tracks **position movement** (↑, ↓, New).
   - Displays updated **Top 10**, highlighting rank changes and adding relevant emojis.
   - Calculates and shows the **Top 5 most improved** team members.

---

### 🔑 Features

- **🏆 Emoji Ranks**: Top 3 performers show only an emoji (no number).
- **🚀 Movement Indicators**: Rocket added for upward movement.
- **Color Coding**: Rank changes are color-coded (green for up, red for down, gray for same).
- **Black Text for Top 3**: All text for top 3 ranks is forced to black for visibility.
- **Timestamp Footer**: Automatically adds the time of last update.
- **Symbol Key**: Helpful legend explaining all symbols used.

---

### 🧩 UI Elements

| ID / Element        | Purpose                                         |
|---------------------|-------------------------------------------------|
| `sortButton`        | Triggers the paste and parsing process         |
| `resetButton`       | Reloads the page to clear all data             |
| `minHours`          | Input box to filter out low-hour entries       |
| `toggleCompact`     | Switches between compact and standard views    |
| `P1Leaders`         | First paste — displays initial top 10          |
| `P2Leaders`         | Second paste — shows new top 10 + movement     |
| `MostImproved`      | Displays top 5 improvements in UPH             |
| `infoFooter`        | Displays timestamp and symbol key              |

---

### 📝 Data Requirements

Paste data copied **directly from CLMS**. The code will:
- Skip the first 21 lines (headers and noise)
- Extract: First name, Last name, Hours, and UPH
- Sort by UPH and filter by minimum hours

---

### 🔄 Reset / Refresh

- Press the **Reset** button to clear the dashboard and start fresh.

---

### 📦 Symbol Key

- 🏆 / 🥈 / 🥉 — Top 3 performers
- ↑ / ↓ — Rank movement since last update
- 🚀 — Significant improvement or upward momentum
- New — Newly ranked TM

---
