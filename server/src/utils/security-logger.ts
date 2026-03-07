export function logSecurityEvent(event: string, details: Record<string, unknown>): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'SECURITY',
      event,
      ...details,
    })
  );
}
