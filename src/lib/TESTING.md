# Outfit Logic Testing

This document describes the test cases for the temperature bucket classification.

## Test Cases

### Celsius to Fahrenheit Conversion
- 0°C → 32°F
- 100°C → 212°F
- -40°C → -40°F

### Fahrenheit to Celsius Conversion
- 32°F → 0°C
- 212°F → 100°C
- -40°F → -40°C

### Temperature Buckets (Fahrenheit)

#### Freezing (< 32°F)
- 31°F → 'freezing'
- 0°F → 'freezing'
- -10°F → 'freezing'

#### Cold (32-50°F)
- 32°F → 'cold'
- 40°F → 'cold'
- 49°F → 'cold'

#### Cool (50-65°F)
- 50°F → 'cool'
- 57°F → 'cool'
- 64°F → 'cool'

#### Mild (65-70°F)
- 65°F → 'mild'
- 67°F → 'mild'
- 69°F → 'mild'

#### Warm (70-80°F)
- 70°F → 'warm'
- 75°F → 'warm'
- 79°F → 'warm'

#### Hot (> 80°F)
- 80°F → 'hot'
- 85°F → 'hot'
- 100°F → 'hot'

### Temperature Buckets (Celsius)

#### Freezing (< 0°C)
- -1°C → 'freezing'
- -10°C → 'freezing'

#### Cold (0-10°C)
- 0°C → 'cold'
- 5°C → 'cold'
- 9°C → 'cold'

#### Cool (10-18°C)
- 10°C → 'cool'
- 14°C → 'cool'
- 17°C → 'cool'

#### Mild (18-21°C)
- 18°C → 'mild'
- 19°C → 'mild'
- 20°C → 'mild'

#### Warm (21-27°C)
- 21°C → 'warm'
- 24°C → 'warm'
- 26°C → 'warm'

#### Hot (> 27°C)
- 27°C → 'hot'
- 30°C → 'hot'
- 35°C → 'hot'

### Boundary Values
All boundaries are inclusive on the lower end and exclusive on the upper end:
- 32°F → 'cold' (not freezing)
- 50°F → 'cool' (not cold)
- 65°F → 'mild' (not cool)
- 70°F → 'warm' (not mild)
- 80°F → 'hot' (not warm)
