/**
 * DAILY
 * - begin = 2021/09/22 07:12
 * - hour > 23 ? ++7 : ++1
 * - min ++24 % 60
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns List of daily occurrences between parameter dates
 */
function getDailyOccurrences(startDate, endDate) {
    const results = [];

    const baseDate = new Date(2021, 8, 22);
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

        if (occurrence >= startDate && occurrence <= endDate) {
            results.push(occurrence);
        }
    }

    return results;
}

/**
 * @returns Next daily occurence from now
 */
function getNextDailyOccurence() {
    const now = new Date();
    const next2Day = new Date(now);
    next2Day.setDate(now.getDate() + 2);
    return getDailyOccurrences(now, next2Day)[0];
}

/**
 * WEEKLY
 * - begin = 2021/09/25 21:45
 * - weekday ++1 % monday
 * - hour = M 11h, T 13h, W 15h, T 17h, F 19h, S 21h, S 9h
 * - min = 15 | 45
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns List of weekly occurences between paramenter dates
 */
function getWeeklyOccurrences(startDate, endDate) {
    const weeklyHours = {
        0: 9, // Sunday
        1: 11, // Monday
        2: 13, // Tuesday
        3: 15, // Wednesday
        4: 17, // Thursday
        5: 19, // Friday
        6: 21, // Saturday
    };
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

        occurrence.setHours(
            weeklyHours[weekday],
            weekIndex % 2 === 0 ? 45 : 15,
            0,
            0,
        );

        if (occurrence > endDate) {
            break;
        }

        if (occurrence >= startDate) {
            results.push(occurrence);
        }

        weekIndex++;
    }

    return results;
}

/**
 * @returns Next weekly occurence from now
 */
function getNextWeeklyOccurence() {
    const now = new Date();
    const next2Week = new Date(now);
    next2Week.setDate(now.getDate() + 9);
    return getWeeklyOccurrences(now, next2Week)[0];
}

/**
 * MONTHLY
 * - begin = 2021/09/25 13:00
 * - last saturday
 * - hour > 23 ? ++7 : ++1
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns List of montlhy occurrences between parameter dates
 */
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

/**
 * @returns Next monthly occurence from now
 */
function getNextMonthlyOccurrence() {
    const now = new Date();
    const next2Month = new Date(now);
    // Start of next 2 month
    next2Month.setMonth(now.getMonth() + 2, 1);
    return getMonthlyOccurrences(now, next2Month)[0];
}
