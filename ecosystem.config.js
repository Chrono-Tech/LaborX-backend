module.exports = {
  apps: [
    {
      name: 'laborx.profile.backend',
      script: 'bin/www',
      watch: ['./'],
      env: {
        PORT: 3001,
        NODE_ENV: 'development',
        DEBUG: '@laborx/profile.backend:*',
        DEBUG_COLORS: true
      }
    }
  ]
}
