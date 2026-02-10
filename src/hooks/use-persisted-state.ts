"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * A hook that persists state to localStorage.
 * Falls back to regular useState if localStorage is not available.
 *
 * @param key - The localStorage key to use
 * @param defaultValue - The default value if nothing is stored
 * @returns A tuple of [value, setValue] similar to useState
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize with default value first (for SSR)
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored) as T)
      }
    } catch {
      // localStorage not available or invalid JSON
    }
    setIsInitialized(true)
  }, [key])

  // Persist to localStorage when value changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage not available or quota exceeded
    }
  }, [key, value, isInitialized])

  const setPersistedValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue(newValue)
    },
    []
  )

  return [value, setPersistedValue]
}
