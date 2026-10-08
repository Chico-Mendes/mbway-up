// DAILY
//   - início = 22/09/2021 07h12
//   - hora ++ 1 | +7
//   - min ++ 24
function getDailyOccurrences(startDate, endDate) {
    const results = [];

    const baseDate = new Date(2021, 8, 22); // 22/09/2021
    const baseHour = 7;
    const baseMinute = 12;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const days = Math.floor((d - baseDate) / 86400000);

        if (days < 0) continue;

        const occurrence = new Date(d);

        occurrence.setHours(
            7 + (days % 17), // 7..23 then back to 7
            (baseMinute + days * 24) % 60, // +24 mod 60
            0,
            0,
        );

        results.push(occurrence);
    }

    return results;
}

// WEEKLY
//   - início = 25/09/2021 21h45
//   - dia semana ++ 1
//   - hora = 2f 11h, 3f 13h, 4f 15h, 5f 17h, 6f 19h, sáb 21h, dom 09h
//   - min = 15 | 45, alternadamente
const weeklyHours = {
    0: 9, // Sunday
    1: 11, // Monday
    2: 13, // Tuesday
    3: 15, // Wednesday
    4: 17, // Thursday
    5: 19, // Friday
    6: 21, // Saturday
};

function getWeeklyOccurrences(startDate, endDate) {
    const results = [];

    // start Saturday Date(2021, 8, 25, 21, 45); 25/09/2021
    const firstWeek = new Date(2021, 8, 20); // Monday 20/09/2021

    let weekIndex = 0;

    while (true) {
        const weekStart = new Date(firstWeek);
        weekStart.setDate(firstWeek.getDate() + weekIndex * 7);

        // Sat -> Sun -> Mon -> Tue -> Wed -> Thu -> Fri -> Sat ...
        const weekday = (6 + weekIndex) % 7;

        const occurrence = new Date(weekStart);

        if (weekday === 0) {
            // Sunday
            occurrence.setDate(occurrence.getDate() + 6);
        } else {
            // Monday=1 ... Saturday=6
            occurrence.setDate(occurrence.getDate() + weekday - 1);
        }

        if (occurrence > endDate) {
            break;
        }

        occurrence.setHours(
            weeklyHours[weekday],
            weekIndex % 2 === 0 ? 45 : 15,
            0,
            0,
        );

        if (occurrence >= startDate) {
            results.push(occurrence);
        }

        weekIndex++;
    }

    return results;
}

// MONTHLY
//   - início 25/09/2021 13h
//   - último sábado
//   - hora ++ 1 | +7
function getMonthlyOccurrences(startDate, endDate) {
    const results = [];

    let index = 0;

    while (true) {
        const year = 2021 + Math.floor((8 + index) / 12);
        const month = (8 + index) % 12;

        // last day of month
        const occurrence = new Date(year, month + 1, 0);

        // move back until Saturday
        while (occurrence.getDay() !== 6) {
            occurrence.setDate(occurrence.getDate() - 1);
        }

        occurrence.setHours(
            7 + ((6 + index) % 17), // same hour logic as daily, starting at 7+6=13h
            0,
            0,
            0,
        );

        if (occurrence > endDate) break;

        if (occurrence >= startDate) {
            results.push(occurrence);
        }

        index++;
    }

    return results;
}
