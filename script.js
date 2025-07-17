async function loadRules() {
    try {
        const response = await fetch("assets/rules.json");
        const data = await response.json();
        return data.map(rule => {
            if (rule.start && rule.end) {
                const [startMonth, startDay] = rule.start.split("-").map(Number);
                const [endMonth, endDay] = rule.end.split("-").map(Number);
                rule.match = (m, d) => {
                    const current = m * 100 + d;
                    const start = startMonth * 100 + startDay;
                    const end = endMonth * 100 + endDay;
                    return current >= start && current <= end;
                };
            }
            return rule;
        });
    } catch (e) {
        console.error("Failed to load rules.json:", e);
        return [];
    }
}

function setTheme(theme) {
    document.getElementById("theme_stylesheet").setAttribute("href", `styles/themes/${theme}/theme.css`);
    document.getElementById("favicon").setAttribute("href", `styles/themes/${theme}/favicon.png`);
    localStorage.setItem("theme", theme);
    setTimeout(function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 50); // It doesn't scroll sometimes for no reason I can discern, unless there is a very slight delay before scrolling ¯\_(ツ)_/¯
}

window.onload = function () {
    loadRules().then(rules => {
        const today = new Date();
        const month = today.getMonth() + 1; // Months are zero-indexed in JavaScript which is dumb and confusing so add one for clarity
        const day = today.getDate();

        let defaultAnswer = "It's basically September";
        let selectedAnswer = null;
        let selectedSubtitle = null;
        let selectedUpdate = null;

        for (const rule of rules) {
            if (rule.match(month, day)) {
                if (rule.answer) selectedAnswer = rule.answer;
                if (rule.subtitle) selectedSubtitle = rule.subtitle;
                if (rule.update) selectedUpdate = rule.update;
                break;
            }
        }

        document.getElementById("answer").innerHTML = selectedAnswer ?? defaultAnswer;
        if (selectedSubtitle) {
            document.getElementById("subtitle").innerHTML = selectedSubtitle;
        }
        if (selectedUpdate) {
            document.getElementById("update").innerHTML = selectedUpdate;
        }

        const defaultTheme = "Relay";

        let params = new URLSearchParams(document.location.search);
        let theme = params.get("theme") ?? localStorage.getItem("theme") ?? defaultTheme;

        const themePicker = document.getElementById("theme");
        themePicker.value = theme;
        setTheme(theme);

        themePicker.addEventListener("change", function () {
            const newTheme = themePicker.value;
            setTheme(newTheme);
        });
    });
};