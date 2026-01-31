import {
  getTemperatureBucket,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  getTemperatureBucketDisplayName,
  getTemperatureBucketDescription,
  type TemperatureBucket,
} from '../outfitLogic'

describe('outfitLogic', () => {
  describe('celsiusToFahrenheit', () => {
    it('should convert 0°C to 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32)
    })

    it('should convert 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBe(212)
    })

    it('should convert -40°C to -40°F', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40)
    })
  })

  describe('fahrenheitToCelsius', () => {
    it('should convert 32°F to 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0)
    })

    it('should convert 212°F to 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100)
    })

    it('should convert -40°F to -40°C', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40)
    })
  })

  describe('getTemperatureBucket - Fahrenheit', () => {
    it('should classify below 32°F as freezing', () => {
      expect(getTemperatureBucket(31, 'F')).toBe('freezing')
      expect(getTemperatureBucket(0, 'F')).toBe('freezing')
      expect(getTemperatureBucket(-10, 'F')).toBe('freezing')
    })

    it('should classify 32-50°F as cold', () => {
      expect(getTemperatureBucket(32, 'F')).toBe('cold')
      expect(getTemperatureBucket(40, 'F')).toBe('cold')
      expect(getTemperatureBucket(49, 'F')).toBe('cold')
    })

    it('should classify 50-65°F as cool', () => {
      expect(getTemperatureBucket(50, 'F')).toBe('cool')
      expect(getTemperatureBucket(57, 'F')).toBe('cool')
      expect(getTemperatureBucket(64, 'F')).toBe('cool')
    })

    it('should classify 65-70°F as mild', () => {
      expect(getTemperatureBucket(65, 'F')).toBe('mild')
      expect(getTemperatureBucket(67, 'F')).toBe('mild')
      expect(getTemperatureBucket(69, 'F')).toBe('mild')
    })

    it('should classify 70-80°F as warm', () => {
      expect(getTemperatureBucket(70, 'F')).toBe('warm')
      expect(getTemperatureBucket(75, 'F')).toBe('warm')
      expect(getTemperatureBucket(79, 'F')).toBe('warm')
    })

    it('should classify above 80°F as hot', () => {
      expect(getTemperatureBucket(80, 'F')).toBe('hot')
      expect(getTemperatureBucket(85, 'F')).toBe('hot')
      expect(getTemperatureBucket(100, 'F')).toBe('hot')
    })
  })

  describe('getTemperatureBucket - Celsius', () => {
    it('should classify below 0°C as freezing', () => {
      expect(getTemperatureBucket(-1, 'C')).toBe('freezing')
      expect(getTemperatureBucket(-10, 'C')).toBe('freezing')
    })

    it('should classify 0-10°C as cold', () => {
      expect(getTemperatureBucket(0, 'C')).toBe('cold')
      expect(getTemperatureBucket(5, 'C')).toBe('cold')
      expect(getTemperatureBucket(9, 'C')).toBe('cold')
    })

    it('should classify 10-18°C as cool', () => {
      expect(getTemperatureBucket(10, 'C')).toBe('cool')
      expect(getTemperatureBucket(14, 'C')).toBe('cool')
      expect(getTemperatureBucket(17, 'C')).toBe('cool')
    })

    it('should classify 18-21°C as mild', () => {
      expect(getTemperatureBucket(18, 'C')).toBe('mild')
      expect(getTemperatureBucket(19, 'C')).toBe('mild')
      expect(getTemperatureBucket(20, 'C')).toBe('mild')
    })

    it('should classify 21-27°C as warm', () => {
      expect(getTemperatureBucket(21, 'C')).toBe('warm')
      expect(getTemperatureBucket(24, 'C')).toBe('warm')
      expect(getTemperatureBucket(26, 'C')).toBe('warm')
    })

    it('should classify above 27°C as hot', () => {
      expect(getTemperatureBucket(27, 'C')).toBe('hot')
      expect(getTemperatureBucket(30, 'C')).toBe('hot')
      expect(getTemperatureBucket(35, 'C')).toBe('hot')
    })
  })

  describe('getTemperatureBucketDisplayName', () => {
    it('should return display names for all buckets', () => {
      expect(getTemperatureBucketDisplayName('freezing')).toBe('Freezing')
      expect(getTemperatureBucketDisplayName('cold')).toBe('Cold')
      expect(getTemperatureBucketDisplayName('cool')).toBe('Cool')
      expect(getTemperatureBucketDisplayName('mild')).toBe('Mild')
      expect(getTemperatureBucketDisplayName('warm')).toBe('Warm')
      expect(getTemperatureBucketDisplayName('hot')).toBe('Hot')
    })
  })

  describe('getTemperatureBucketDescription', () => {
    it('should return Fahrenheit descriptions', () => {
      expect(getTemperatureBucketDescription('freezing', 'F')).toBe('Below 32°F')
      expect(getTemperatureBucketDescription('cold', 'F')).toBe('32-50°F')
      expect(getTemperatureBucketDescription('cool', 'F')).toBe('50-65°F')
      expect(getTemperatureBucketDescription('mild', 'F')).toBe('65-70°F')
      expect(getTemperatureBucketDescription('warm', 'F')).toBe('70-80°F')
      expect(getTemperatureBucketDescription('hot', 'F')).toBe('Above 80°F')
    })

    it('should return Celsius descriptions', () => {
      expect(getTemperatureBucketDescription('freezing', 'C')).toBe('Below 0°C')
      expect(getTemperatureBucketDescription('cold', 'C')).toBe('0-10°C')
      expect(getTemperatureBucketDescription('cool', 'C')).toBe('10-18°C')
      expect(getTemperatureBucketDescription('mild', 'C')).toBe('18-21°C')
      expect(getTemperatureBucketDescription('warm', 'C')).toBe('21-27°C')
      expect(getTemperatureBucketDescription('hot', 'C')).toBe('Above 27°C')
    })
  })

  describe('edge cases', () => {
    it('should handle boundary values correctly in Fahrenheit', () => {
      // Exactly at boundaries
      expect(getTemperatureBucket(32, 'F')).toBe('cold') // not freezing
      expect(getTemperatureBucket(50, 'F')).toBe('cool') // not cold
      expect(getTemperatureBucket(65, 'F')).toBe('mild') // not cool
      expect(getTemperatureBucket(70, 'F')).toBe('warm') // not mild
      expect(getTemperatureBucket(80, 'F')).toBe('hot') // not warm
    })

    it('should handle boundary values correctly in Celsius', () => {
      // Exactly at boundaries
      expect(getTemperatureBucket(0, 'C')).toBe('cold') // not freezing
      expect(getTemperatureBucket(10, 'C')).toBe('cool') // not cold
      expect(getTemperatureBucket(18, 'C')).toBe('mild') // not cool
      expect(getTemperatureBucket(21, 'C')).toBe('warm') // not mild
      expect(getTemperatureBucket(27, 'C')).toBe('hot') // not warm
    })

    it('should default to Fahrenheit when unit is not specified', () => {
      expect(getTemperatureBucket(75)).toBe('warm')
      expect(getTemperatureBucket(30)).toBe('cold')
    })
  })
})
