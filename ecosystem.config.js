module.exports = {
  apps: [
    {
      name: 'mock-hls-server',
      script: './bin/cli.js',
      instances: 4, // Number of instances
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 8080,
        HOST: 'localhost',
        WINDOW_SIZE: 10,
        INITIAL_DURATION: 10,
        LOG_LEVEL: 'info'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 80,
        HOST: '0.0.0.0',
        WINDOW_SIZE: 30,
        INITIAL_DURATION: 20,
        LOG_LEVEL: 'warn'
      },
      // PM2 specific options
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      // Clustering options
      listen_timeout: 3000,
      kill_timeout: 5000
    }
  ]
};
