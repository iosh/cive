---
"cive": minor
---

Removed the addressType parameter from the hexAddressToBase32 function. The function now determines the base32 address type based on the prefix of the hex address passed in (0x1, 0x8, or 0x0).