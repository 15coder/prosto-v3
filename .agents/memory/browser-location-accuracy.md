---
name: Browser location accuracy
description: The accuracy boundary for delivery coordinates collected in a mobile browser.
---

Do not treat a browser geolocation result as exact just because `enableHighAccuracy` is enabled. Collect fresh readings, keep the best reported accuracy, reject coarse fixes, and let the customer confirm or paste coordinates from a trusted maps app when the device cannot provide a reliable GPS fix.

**Why:** A mobile browser may return a stale, Wi-Fi, or cell-tower estimate that is hundreds of metres away from the phone's blue-dot location. The accuracy value is an estimate, not a guarantee.

**How to apply:** For delivery-critical coordinates, wait for a fresh high-accuracy reading, show the accepted uncertainty to the customer, and never silently send an unverified coarse location.