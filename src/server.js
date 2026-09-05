import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('cambia_esta')) {
  console.warn('Define JWT_SECRET en .env con un valor aleatorio y seguro.');
}

const { default: app } = await import('./app.js');

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`API REST en http://localhost:${PORT}`);
  console.log('Health: GET /api/health');
});
