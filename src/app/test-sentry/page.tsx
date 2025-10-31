'use client'

import * as Sentry from '@sentry/nextjs'

export default function TestSentryPage() {
  const testClientError = () => {
    throw new Error('Test Client Error - Triggered from UI button')
  }

  const testServerError = async () => {
    try {
      await fetch('/api/sentry-example-api')
    } catch (error) {
      console.error('Server error test:', error)
    }
  }

  const testManualCapture = () => {
    Sentry.captureMessage('Test manual message from Sentry test page', 'info')
    alert('Manual message sent to Sentry (check dashboard)')
  }

  const testManualException = () => {
    const error = new Error('Test Manual Exception')
    Sentry.captureException(error)
    alert('Manual exception sent to Sentry (check dashboard)')
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sentry Error Testing</h1>
        <p className="text-gray-600">
          Use these buttons to test Sentry error tracking integration.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <button
            onClick={testClientError}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Test Client Error
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Throws an error in the browser (caught by error boundary)
          </p>
        </div>

        <div>
          <button
            onClick={testServerError}
            className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            Test Server API Error
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Triggers an error in a server-side API route
          </p>
        </div>

        <div>
          <button
            onClick={testManualCapture}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Test Manual Message
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Manually sends an info message to Sentry
          </p>
        </div>

        <div>
          <button
            onClick={testManualException}
            className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          >
            Test Manual Exception
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Manually captures and sends an exception to Sentry
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Click any button to trigger a test error</li>
          <li>Check the browser console for development logs</li>
          <li>Check Sentry dashboard to see captured errors (staging/production only)</li>
          <li>Note: Errors are NOT sent in development mode</li>
        </ol>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> In development mode, errors are logged to console but NOT sent to Sentry.
          Deploy to staging or production to test actual Sentry integration.
        </p>
      </div>
    </div>
  )
}
