import { Info } from 'lucide-react'
import './ServicesHome.css'

export default function ServiceWalletDemoNotice() {
  return (
    <aside className="service-wallet-demo-notice" role="note">
      <Info size={18} aria-hidden="true" />
      <div>
        <strong>Development wallet data</strong>
        <p>The existing wallet service stores balances, funding details, and transactions in this browser. These values are not production financial data.</p>
      </div>
    </aside>
  )
}
