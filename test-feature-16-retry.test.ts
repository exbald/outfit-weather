/**
 * Feature #16: API error handling with retry
 *
 * Test Suite:
 * 1. Exponential backoff retry logic (1s, 2s, 4s, max 10s)
 * 2. User-friendly error messages for different error types
 * 3. Network errors are caught and handled gracefully
 * 4. Retry attempts are logged to console
 * 5. Max retries can be configured
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { retryWithBackoff, WeatherApiError, fetchCurrentWeather } from './src/lib/openmeteo'

describe('Feature #16: API error handling with retry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')

      const promise = retryWithBackoff(mockFn)

      // Advance timers to resolve immediately
      const result = await promise

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should retry with exponential backoff on failure', async () => {
      let attempts = 0
      const mockFn = vi.fn().mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          throw new Error('Temporary failure')
        }
        return 'success'
      })

      const promise = retryWithBackoff(mockFn, {
        initialDelayMs: 100,
        backoffMultiplier: 2
      })

      // Wait for first attempt (fails)
      await vi.advanceTimersByTimeAsync(0)

      // Wait for retry delay (100ms)
      await vi.advanceTimersByTimeAsync(100)

      // Wait for second retry delay (200ms)
      await vi.advanceTimersByTimeAsync(200)

      const result = await promise

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should respect max retry limit', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Persistent failure'))

      const promise = retryWithBackoff(mockFn, {
        maxRetries: 2,
        initialDelayMs: 100
      })

      // First attempt fails
      await vi.advanceTimersByTimeAsync(0)

      // Retry 1 (100ms)
      await vi.advanceTimersByTimeAsync(100)

      // Retry 2 (200ms)
      await vi.advanceTimersByTimeAsync(200)

      // Should throw after max retries
      await expect(promise).rejects.toThrow('Persistent failure')
      expect(mockFn).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('should cap delay at maxDelayMs', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Always fails'))

      const promise = retryWithBackoff(mockFn, {
        maxRetries: 5,
        initialDelayMs: 1000,
        backoffMultiplier: 10,
        maxDelayMs: 5000
      })

      // First attempt
      await vi.advanceTimersByTimeAsync(0)

      // Retry 1: 1000ms
      await vi.advanceTimersByTimeAsync(1000)

      // Retry 2: would be 10000ms, but capped at 5000ms
      await vi.advanceTimersByTimeAsync(5000)

      // Retry 3: still capped at 5000ms
      await vi.advanceTimersByTimeAsync(5000)

      // Retry 4: still capped at 5000ms
      await vi.advanceTimersByTimeAsync(5000)

      // Retry 5: still capped at 5000ms
      await vi.advanceTimersByTimeAsync(5000)

      await expect(promise).rejects.toThrow('Always fails')
      expect(mockFn).toHaveBeenCalledTimes(6) // Initial + 5 retries
    })

    it('should use default retry config when not specified', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Default config failure'))

      const promise = retryWithBackoff(mockFn)

      // Default maxRetries is 3, so 4 total attempts
      for (let i = 0; i < 4; i++) {
        const delay = i === 0 ? 0 : Math.min(1000 * Math.pow(2, i - 1), 10000)
        await vi.advanceTimersByTimeAsync(delay)
      }

      await expect(promise).rejects.toThrow('Default config failure')
      expect(mockFn).toHaveBeenCalledTimes(4)
    })
  })

  describe('WeatherApiError', () => {
    it('should create error with user-friendly message', () => {
      const error = new WeatherApiError(
        'Technical details',
        'Something went wrong. Please try again.',
        true
      )

      expect(error.message).toBe('Technical details')
      expect(error.userMessage).toBe('Something went wrong. Please try again.')
      expect(error.isRetryable).toBe(true)
      expect(error.name).toBe('WeatherApiError')
    })

    it('should have default isRetryable true', () => {
      const error = new WeatherApiError('Tech', 'User')

      expect(error.isRetryable).toBe(true)
    })
  })

  describe('fetchCurrentWeather error handling', () => {
    it('should throw WeatherApiError on network failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))

      await expect(fetchCurrentWeather(0, 0)).rejects.toThrow(WeatherApiError)
    })

    it('should throw WeatherApiError with user-friendly message on HTTP 429', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests'
        } as Response)
      )

      const error = await fetchCurrentWeather(0, 0).catch(e => e)

      expect(error).toBeInstanceOf(WeatherApiError)
      expect(error.userMessage).toContain('Too many requests')
      expect(error.isRetryable).toBe(true)
    })

    it('should throw WeatherApiError with user-friendly message on HTTP 404', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        } as Response)
      )

      const error = await fetchCurrentWeather(0, 0).catch(e => e)

      expect(error).toBeInstanceOf(WeatherApiError)
      expect(error.userMessage).toContain('temporarily unavailable')
      expect(error.isRetryable).toBe(true)
    })

    it('should throw WeatherApiError on HTTP 500', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        } as Response)
      )

      const error = await fetchCurrentWeather(0, 0).catch(e => e)

      expect(error).toBeInstanceOf(WeatherApiError)
      expect(error.userMessage).toContain('having issues')
      expect(error.isRetryable).toBe(true)
    })

    it('should throw WeatherApiError with user-friendly message on HTTP 400', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        } as Response)
      )

      const error = await fetchCurrentWeather(0, 0).catch(e => e)

      expect(error).toBeInstanceOf(WeatherApiError)
      expect(error.userMessage).toContain('Invalid location')
      expect(error.isRetryable).toBe(false)
    })

    it('should throw WeatherApiError on invalid response data', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ invalid: 'data' })
        } as Response)
      )

      const error = await fetchCurrentWeather(0, 0).catch(e => e)

      expect(error).toBeInstanceOf(WeatherApiError)
      expect(error.userMessage).toContain('invalid weather data')
      expect(error.isRetryable).toBe(true)
    })
  })
})
