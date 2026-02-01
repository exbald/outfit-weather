# Action Required: 7-Day Weather Forecast

No manual steps required for this feature.

The Open-Meteo API already returns 16 days of forecast data - this is purely a frontend change to extract and display more days.

---

## Testing Notes

After implementation, test on:
- [ ] Mobile viewport (320px) - verify tab scrolling works
- [ ] Tablet viewport (768px) - tabs may fit without scroll
- [ ] Desktop viewport (1024px+) - all tabs visible

## Cache Considerations

Existing weather cache format will change. Users with old cached data may see temporary issues on first load. The app handles this gracefully by fetching fresh data.
