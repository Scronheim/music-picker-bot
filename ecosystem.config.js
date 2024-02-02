module.exports = {
  apps : [{
      name: "Music picker bot",
      script: "./index.js",
      watch: true,
      env: {
          TELEGRAM_BOT_TOKEN: "5926377809:AAHhlXICsyYA5074W-FDsrxLVyKQCG1-APQ",
          DISCOGS_TOKEN: "RWNuSgaVIhzpBfcHiUtiVWQkobWmymWkqdmsKnAA",
      }
  }]
}