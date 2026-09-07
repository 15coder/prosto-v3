---
name: Netlify Telegram delivery
description: The deployment boundary between the static PROSTO frontend and its server-side Telegram function.
---

The PROSTO Netlify deployment keeps Telegram credentials in the Function runtime and never exposes them through the Vite browser bundle. The frontend calls the same-origin Netlify Function, which validates the order and sends the Telegram message.

**Why:** Netlify's static publish directory does not run the workspace's Express API process, so environment variables are only useful for Telegram when the request handler runs as a Netlify Function or another deployed backend.

**How to apply:** Keep TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID as server-side Production/Functions variables in Netlify. Do not prefix them with VITE_ or place their values in tracked files.