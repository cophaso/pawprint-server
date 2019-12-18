module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || `postgresql://postgres:G0d3sdeveloper@localhost/pawprint`, //add database
}