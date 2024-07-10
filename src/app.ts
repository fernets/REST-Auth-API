import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';
// import path from 'path'
import connectToDB from './utils/connectToDB';
import log from './utils/logger';
import routes from './routes';
import jsonParseError from './middleware/jsonParseError.middleware';
import deserializeUser from './middleware/deserializeUser.middleware';
import swaggerDocs from './utils/swagger';

const app = express();

app.use(express.json());
app.use(jsonParseError);
app.use(cors());
app.use(helmet());

app.use(deserializeUser);

app.use('/api/v1', routes);

const PORT = config.get<number>('port');
const BASE_URL = config.get<string>('baseUrl');

// For SPA
// if (config.get<string>('nodeEnv') === 'production') {
//   app.use('/', express.static(path.join(__dirname, 'client')));

//   const indexPath = path.join(__dirname, 'client', 'index.html');

//   app.get('*', (req, res) => {
//     res.sendFile(indexPath);
//   });
// }

/**
 * Initializes and starts the Express application server.
 *
 * This function performs the following tasks:
 * 1. Starts the Express server on the specified port.
 * 2. Logs the server start information.
 * 3. Establishes a connection to the database.
 * 4. Sets up Swagger documentation for the API.
 *
 * @returns {void} This function doesn't return a value.
 */
function start() {
  app.listen(PORT, async () => {
    log.info(`App started at ${BASE_URL}:${PORT}`);

    await connectToDB();

    swaggerDocs(app, BASE_URL, PORT);
  });
}

start();
