/**
 * Formats a time in seconds to a string in the format "MM:SS".
 * @param time - The time in seconds.
 * @returns The formatted time string.
 */
export function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    if (minutes > 0) {
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else if (seconds > 0) {
        return `${seconds}:${milliseconds}`;
    } else if (milliseconds > 0) {
        return `${milliseconds}`;   
    } else {
        return '0';
    }
}