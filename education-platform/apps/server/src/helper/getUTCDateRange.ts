export function getUTCDateRange(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);

    const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    const end = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0));

    return { start, end };
}