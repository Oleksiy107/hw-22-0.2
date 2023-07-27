import fastify from "fastify";
import cors from '@fastify/cors';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const server = fastify();
server.register(cors);

const questions = [
  {
    caption: 'Подія натискання на елемент називається click?',
    correctAnswer: true
  },
  {
    caption: 'Усередині розмітки не можна додати обробник події?',
    correctAnswer: false
  },
  {
    caption: 'Припинити спливання події можна за допомогою метода stopImmediatePropagation?',
    correctAnswer: false
  },
  {
    caption: 'Припинити спливання події можна за допомогою метода stopPropagation?',
    correctAnswer: true
  }
];

server.get('/', async (request, reply) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fileContent = await readFile(resolve(__dirname, '../public/index.html'), 'utf-8');
    reply.type('text/html').send(fileContent);
  } catch (err) {
    console.error('Error reading index.html:', err);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

server.get('/api/questions', async (request, reply) => {
  return questions;
});

server.post('/api/submit', async (request, reply) => {
  const userAnswers = request.body.answers;
  let score = 0;

  if (Array.isArray(userAnswers) && userAnswers.length === questions.length) {
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correctAnswer) {
        score++;
      }
    }
  } else {
    return reply.status(400).send({ error: 'Invalid request data.' });
  }

  return { score };
});

const port = 5555;
const address = 'localhost';

const start = async () => {
  try {
    await server.listen(port, address);
    console.log(`Server is running on http://${address}:${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
