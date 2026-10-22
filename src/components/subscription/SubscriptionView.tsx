import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PLAN_CONFIGS } from '../../data/mockData';
import {
  CreditCard,
  Check,
  ShieldCheck,
  Zap,
  Building,
  Download,
  CheckCircle2,
  Lock,
  X,
  FileText
} from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { currentSchool, currentUser, invoices, upgradeSubscription } = useSchool();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Checkout Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<'starter' | 'pro' | 'enterprise' | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [billingName, setBillingName] = useState('Oakridge International Financial Office');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Receipt Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const isCurrentPlan = (planId: string) => currentSchool.plan === planId;

  const handleOpenCheckout = (planId: 'starter' | 'pro' | 'enterprise') => {
    setSelectedPlanForCheckout(planId);
    setPaymentSuccess(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    setIsProcessing(true);
    setTimeout(() => {
      upgradeSubscription(selectedPlanForCheckout, billingCycle);
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlanForCheckout(null);
      }, 1500);
    }, 1000);
  };

  const activePlanConfig = PLAN_CONFIGS[currentSchool.plan] || PLAN_CONFIGS.pro;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Subscription &amp; Licensing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your institution's subscription tier, billing period, and seat allocations.
          </p>
        </div>

        {/* Current Active Plan Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Active Tier: {activePlanConfig.name}</span>
          </div>
        </div>
      </div>

      {/* Quota Usage Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Current Tier Allocations &amp; Resource Quotas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Enrolled Students</span>
              <span className="font-mono tabular-nums text-slate-900 font-bold">
                {currentSchool.stats.totalStudents} / {activePlanConfig.maxStudents}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (currentSchool.stats.totalStudents / activePlanConfig.maxStudents) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">
              {activePlanConfig.maxStudents - currentSchool.stats.totalStudents} seats remaining
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Faculty &amp; Staff Logins</span>
              <span className="font-mono tabular-nums text-slate-900 font-bold">
                {currentSchool.stats.totalTeachers} / {activePlanConfig.maxTeachers}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (currentSchool.stats.totalTeachers / activePlanConfig.maxTeachers) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">
              {activePlanConfig.maxTeachers - currentSchool.stats.totalTeachers} faculty seats available
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Google Meet Live Classes</span>
              <span className="font-bold text-emerald-600">
                {activePlanConfig.googleMeetEnabled ? 'Unlimited' : 'Disabled'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: activePlanConfig.googleMeetEnabled ? '100%' : '0%' }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">
              {activePlanConfig.googleMeetEnabled ? 'Full Google Meet integration active' : 'Upgrade to enable live classes'}
            </span>
          </div>
        </div>
      </div>

      {/* Billing Cadence Toggle */}
      <div className="flex flex-col items-center justify-center space-y-2 pt-2">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Save 20%
            </span>
          </button>
        </div>
        <span className="text-[11px] text-slate-400">All annual plans include invoiced purchase orders.</span>
      </div>

      {/* Pricing Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(PLAN_CONFIGS) as ('starter' | 'pro' | 'enterprise')[]).map((key) => {
          const plan = PLAN_CONFIGS[key];
          const isCurrent = isCurrentPlan(key);
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const isPro = key === 'pro';

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col justify-between relative bg-white transition-shadow ${
                isPro
                  ? 'border-blue-400 ring-1 ring-blue-400 shadow-sm'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Current Plan
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 min-h-[34px] leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="my-5 pb-5 border-b border-slate-200">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      /{billingCycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && price > 0 && (
                    <span className="text-[11px] font-mono text-emerald-600 block mt-1">
                      Equivalent to ${Math.round(price / 12)}/month
                    </span>
                  )}
                </div>

                {/* Feature Bullet List */}
                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-default border border-slate-200"
                  >
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCheckout(key)}
                    className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isPro
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {key === 'starter' ? 'Downgrade to Starter' : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices & Billing History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Official Invoices &amp; Receipts</h2>
            <p className="text-xs text-slate-500">Download historical payment receipts and audit statements.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Tax ID: US-EDU-992014</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Billing Date</th>
                <th className="px-6 py-3">Plan Description</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600">{inv.date}</td>
                  <td className="px-6 py-3.5 text-slate-800 font-medium">{inv.planName}</td>
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                    ${inv.amount}.00
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Paid</span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Checkout / Upgrade Simulation */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Subscription Tier</h3>
                <span className="text-xs text-slate-500">
                  {PLAN_CONFIGS[selectedPlanForCheckout].name} · {billingCycle}
                </span>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>Selected Tier:</span>
                  <span className="font-semibold">{PLAN_CONFIGS[selectedPlanForCheckout].name}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Billing Cadence:</span>
                  <span className="capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
                  <span>Total Due Today:</span>
                  <span className="font-mono">
                    $
                    {billingCycle === 'annual'
                      ? PLAN_CONFIGS[selectedPlanForCheckout].annualPrice
                      : PLAN_CONFIGS[selectedPlanForCheckout].monthlyPrice}
                    .00
                  </span>
                </div>
              </div>

              {PLAN_CONFIGS[selectedPlanForCheckout].monthlyPrice > 0 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Billing Organization / Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-xs font-mono pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Subscription tier activated immediately!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Processing...' : 'Confirm Upgrade'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Receipt */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Institutional Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono font-semibold text-slate-800">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billed Campus:</span>
                <span className="font-semibold text-slate-800">{currentSchool.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Paid:</span>
                <span className="font-mono text-slate-800">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tier Description:</span>
                <span className="text-slate-800">{selectedInvoice.planName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Total Charged:</span>
                <span className="font-mono text-slate-900">${selectedInvoice.amount}.00 USD</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
