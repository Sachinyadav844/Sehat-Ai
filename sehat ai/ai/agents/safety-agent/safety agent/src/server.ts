import app from './api/app';
import {logInfo} from './utils/logger';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  logInfo('Safety Agent listening', {port});
});
