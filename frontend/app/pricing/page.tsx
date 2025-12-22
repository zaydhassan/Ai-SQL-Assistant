export default function PricingPage() {
  return (
    <main className="container py-20">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Pricing</h1>
        <p className="mt-3 text-muted">
          Simple pricing that grows with your needs.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-saas">
          <h3 className="text-lg font-semibold">Free</h3>
          <p className="mt-2 text-muted">For learning & exploration</p>
          <p className="mt-6 text-2xl font-bold">₹0</p>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• Limited uploads</li>
            <li>• Basic queries</li>
            <li>• Community support</li>
          </ul>
        </div>

        <div className="card-saas border-indigo-500/40">
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="mt-2 text-muted">For professionals</p>
          <p className="mt-6 text-2xl font-bold">₹999 / mo</p>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• Unlimited datasets</li>
            <li>• Faster queries</li>
            <li>• Priority support</li>
          </ul>
        </div>

        <div className="card-saas">
          <h3 className="text-lg font-semibold">Team</h3>
          <p className="mt-2 text-muted">For organizations</p>
          <p className="mt-6 text-2xl font-bold">Custom</p>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• Team access</li>
            <li>• Advanced security</li>
            <li>• SLA & onboarding</li>
          </ul>
        </div>
      </div>
    </main>
  );
}