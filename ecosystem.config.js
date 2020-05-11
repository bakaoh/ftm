module.exports = {
  apps: [
    {
      name: "ftm",
      script: "src/index.js",
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "1500M",
      watch: false
    }
  ]
};
