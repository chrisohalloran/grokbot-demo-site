const listeners = new Set<() => void>();
let left = 0;
let running = false;

export function onRender(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function pump(): void {
  listeners.forEach((fn) => fn());
  left -= 1;
  if (left > 0) requestAnimationFrame(pump);
  else running = false;
}

export function burstRender(frames = 12): void {
  left = Math.max(left, frames);
  if (running) return;
  running = true;
  requestAnimationFrame(pump);
}
