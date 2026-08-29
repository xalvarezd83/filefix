import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            ← Back to FileFix
          </Link>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight">
            Simple pricing
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Start free. Upgrade when you need more file processing and
            automation.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500">FileFix Pro</p>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">
                $4.99
              </span>
              <span className="text-gray-500">/ month</span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Everything you need to validate and fix your files.
            </p>
          </div>

          <ul className="space-y-4 text-sm">
            <li>✓ CSV and Excel validation</li>
            <li>✓ Validation templates</li>
            <li>✓ Detailed error reports</li>
            <li>✓ Clean file generation</li>
            <li>✓ File history</li>
            <li>✓ AI file assistant</li>
          </ul>

          <button
            type="button"
            className="mt-8 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Upgrade to Pro
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Cancel anytime.
          </p>
        </div>
      </div>
    </main>
  );
}