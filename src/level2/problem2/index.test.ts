export type DowntimeLogs = [Date, Date][];

export function merge(...logs: DowntimeLogs[]): DowntimeLogs {
  const intervals = logs.flat().sort((a, b) => a[0].getTime() - b[0].getTime());

  const merged: DowntimeLogs = [];
  for (const [start, end] of intervals) {
    if (!merged.length) {
      merged.push([start, end]);
      continue;
    }

    const last = merged[merged.length - 1];
    if (start.getTime() > last[1].getTime()) {
      merged.push([start, end]);
    } else {
      if (end.getTime() > last[1].getTime()) {
        last[1] = end;
      }
    }
  }

  return merged;
}
