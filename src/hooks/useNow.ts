import { useEffect, useState } from 'react';

// Current time that refreshes every minute, so "upcoming" and "past" stay correct while the page is open.
export function useNow(intervalMs = 60000): number {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(timer);
    }, [intervalMs]);

    return now;
}
