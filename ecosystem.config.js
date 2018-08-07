module.exports = {
  apps: [
    {
      name: 'laborx.profile.backend',
      script: 'bin/www',
      watch: true,
      env: {
        PORT: 3001,
        NODE_ENV: 'development'
      }
    }
  ]
}
