export const logEvent = (event: string, details?: Record<string, unknown>): void => {
  const payload = {
    timestamp: new Date().toISOString(),
    service: 'severity-agent',
    event,
    ...details
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
};
