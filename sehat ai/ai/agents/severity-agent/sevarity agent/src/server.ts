import app from './app';
import { logEvent } from './logging';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  logEvent('Service Started', { port: PORT });
  // eslint-disable-next-line no-console
  console.log(`Severity Agent listening on port ${PORT}`);
});
