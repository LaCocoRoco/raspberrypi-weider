module.exports = {
  apps: [
    {
      name: 'weider',
      script: 'app.js',
      log_file: 'log/comb.log',
      out_file: 'log/out.log',
      error_file: 'log/error.log',
      log_date_format: "YYYY-MM-DD HH:mm Z",
      watch: ['config', 'controllers', 'public', 'routes', 'views'],
      max_memory_restart: '1G',
      max_restarts: 5,
      min_uptime: 5000,
      autorestart: true,
      instances: 1,
      env: {
        PORT: 8080,
        NODE_ENV: 'development',
        LOG_LEVEL: 0,
      },
      env_deb: {
        PORT: 8080,
        NODE_ENV: 'debug',
        LOG_LEVEL: 2,
      },
      env_prod: {
        PORT: 8080,
        NODE_ENV: 'production',
        LOG_LEVEL: 5,
      },
    },
    {
      name: 'receiver',
      script: 'tests/receiver.js',
      log_file: 'NULL',
      out_file: 'NULL',
      error_file: 'NULL',
      watch: ['tests'],
      max_memory_restart: '1G',
      max_restarts: 5,
      min_uptime: 5000,
      autorestart: true,
      instances: 1,
      env: {
        NODE_ENV: 'development',
        LOG_LEVEL: 0,
      },
      env_deb: {
        NODE_ENV: 'debug',
        LOG_LEVEL: 2,
      },
    },
  ],
};
