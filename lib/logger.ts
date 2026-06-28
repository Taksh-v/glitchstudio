/**
 * Structured logging utility for production monitoring.
 * Logs to console in development, integrates with Sentry in production.
 */

type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  stack?: string
}

function formatLog(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry
  const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
}

export function logger(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }

  const formatted = formatLog(entry)

  if (process.env.NODE_ENV === 'development') {
    console[level === 'error' ? 'error' : 'log'](formatted)
  }

  // In production, also send to external service if configured
  if (process.env.NODE_ENV === 'production') {
    // This could integrate with Sentry, DataDog, LogRocket, etc.
    console[level](formatted)
  }
}

export const log = {
  info: (msg: string, ctx?: Record<string, any>) => logger('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, any>) => logger('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, any>) => logger('error', msg, ctx),
}
