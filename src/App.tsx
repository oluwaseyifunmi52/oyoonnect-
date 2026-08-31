import { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ProtectedRoute, PublicOnlyRoute, ServicesRoute, ProviderRoute } from './components/common'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { AdminLayout } from './components/admin/AdminLayout'

const Home = lazy(() => import('./pages/Home'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const BusinessProfile = lazy(() => import('./pages/BusinessProfile'))
const ListBusiness = lazy(() => import('./pages/ListBusiness'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const SavedBusinesses = lazy(() => import('./pages/SavedBusinesses'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const SettingsNotifications = lazy(() => import('./pages/SettingsNotifications'))
const SettingsAppearance = lazy(() => import('./pages/SettingsAppearance'))
const SettingsPrivacy = lazy(() => import('./pages/SettingsPrivacy'))
const SettingsSecurity = lazy(() => import('./pages/SettingsSecurity'))
const Notifications = lazy(() => import('./pages/Notifications'))
// Legacy owner/business-office dashboards were consolidated into /business/dashboard.
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const PendingListings = lazy(() => import('./pages/admin/PendingListings'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminRegister = lazy(() => import('./pages/admin/AdminRegister'))
const AdminBusinesses = lazy(() => import('./pages/admin/AdminBusinesses'))
const AdminVerification = lazy(() => import('./pages/admin/AdminVerification'))
const AdminJobCategories = lazy(() => import('./pages/admin/AdminJobCategories'))
const AdminCommunity = lazy(() => import('./pages/admin/AdminCommunity'))
const AdminHelp = lazy(() => import('./pages/admin/AdminHelp'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const Categories = lazy(() => import('./pages/Categories'))

// Business Office pages
// Legacy business-office dashboard consolidated into /business/dashboard.

// New dual-auth pages
const BusinessPortal = lazy(() => import('./pages/BusinessPortal'))
const BusinessRegistration = lazy(() => import('./pages/BusinessRegistration'))
const ServicesDashboard = lazy(() => import('./pages/ServicesDashboard'))
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'))
const UserDashboard = lazy(() => import('./pages/UserDashboard'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

// Unified 3-account-type pages
const AccountPage = lazy(() => import('./pages/AccountPage'))
const ProviderOnboarding = lazy(() => import('./pages/provider/ProviderOnboarding'))
const ProviderLayout = lazy(() => import('./pages/provider/ProviderLayout'))
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard'))
const ProviderProfile = lazy(() => import('./pages/provider/ProviderProfile'))
const ProviderServices = lazy(() => import('./pages/provider/ProviderServices'))
const ProviderRequests = lazy(() => import('./pages/provider/ProviderRequests'))
const ServiceDiscovery = lazy(() => import('./pages/services/ServiceDiscovery'))
const ServiceRequest = lazy(() => import('./pages/services/ServiceRequest'))
const MyRequests = lazy(() => import('./pages/services/MyRequests'))

// Unauthorized page
const Unauthorized = lazy(() => import('./pages/Unauthorized'))

// Job pages
const JobsListing = lazy(() => import('./pages/jobs/JobsListing'))
const JobDetail = lazy(() => import('./pages/jobs/JobDetail'))
const PostJob = lazy(() => import('./pages/jobs/PostJob'))

// Job Seeker pages
const JobSeekerDashboard = lazy(() => import('./pages/job-seeker/JobSeekerDashboard'))
const JobSeekerLayout = lazy(() => import('./pages/job-seeker/JobSeekerLayout'))

// Hidden transaction features - accessible via direct URL only (Coming Soon)
const ComingSoon = lazy(() => import('./pages/ComingSoon'))

// Services pages (hidden from main nav, accessible via direct URL)
const ServicesHome = lazy(() => import('./pages/ServicesHome'))
const Data = lazy(() => import('./pages/Data'))
const Airtime = lazy(() => import('./pages/Airtime'))
const Electricity = lazy(() => import('./pages/Electricity'))
const TV = lazy(() => import('./pages/TV'))
const Education = lazy(() => import('./pages/Education'))
const RechargePin = lazy(() => import('./pages/RechargePin'))
const DigitalProducts = lazy(() => import('./pages/DigitalProducts'))
const Games = lazy(() => import('./pages/Games'))
const SocialMedia = lazy(() => import('./pages/SocialMedia'))

// Wallet & Transaction pages (hidden from main nav)
const Wallet = lazy(() => import('./pages/Wallet'))
const WalletFund = lazy(() => import('./pages/WalletFund'))
const WalletTransactions = lazy(() => import('./pages/WalletTransactions'))
const Transactions = lazy(() => import('./pages/Transactions'))
const TransactionDetail = lazy(() => import('./pages/TransactionDetail'))

// Affiliate/Share & Earn pages (hidden from main nav)
const AffiliateDashboard = lazy(() => import('./pages/affiliate/AffiliateDashboard'))
const AffiliateReferrals = lazy(() => import('./pages/affiliate/Referrals'))
const AffiliateEarnings = lazy(() => import('./pages/affiliate/Earnings'))
const AffiliateWithdrawals = lazy(() => import('./pages/affiliate/Withdrawals'))

// Community pages
const CommunityHome = lazy(() => import('./pages/community/CommunityHome'))
const CommunityCategoryPage = lazy(() => import('./pages/community/CommunityCategoryPage'))
const CommunityReportForm = lazy(() => import('./pages/community/CommunityReportForm'))
const CommunityReportDetail = lazy(() => import('./pages/community/CommunityReportDetail'))

// Help/Community Support pages
const HelpLandingPage = lazy(() => import('./pages/help/HelpLandingPage'))
const HelpRequestsPage = lazy(() => import('./pages/help/HelpRequestsPage'))
const RequestHelpPage = lazy(() => import('./pages/help/RequestHelpPage'))
const SupportRequestDetailsPage = lazy(() => import('./pages/help/SupportRequestDetailsPage'))
const RequestSuccessPage = lazy(() => import('./pages/help/RequestSuccessPage'))
const HelpLayout = lazy(() => import('./pages/help/HelpLayout'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function PageSkeleton() {
  return (
    <div className="page-skeleton" role="status" aria-label="Loading page content">
      <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', margin: '0 auto 16px' }} />
      <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton skeleton--media" style={{ aspectRatio: '4/3', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main id="main-content" className="app__main">
          <Suspense fallback={<PageSkeleton />}>
            <ErrorBoundary>
              <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/business/:id" element={<BusinessProfile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/list-business" element={<ListBusiness />} />

              {/* Jobs routes */}
              <Route path="/jobs" element={<JobsListing />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/post" element={<PostJob />} />

              {/* Community routes */}
              <Route path="/community" element={<CommunityHome />} />
              <Route path="/community/report" element={<CommunityReportForm />} />
              <Route path="/community/report/:id" element={<CommunityReportDetail />} />
              <Route path="/community/:categorySlug" element={<CommunityCategoryPage />} />

              {/* Unified auth - ONE ACCOUNT */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Navigate to="/login" replace />} />

              {/* Account selection page (kept for compatibility, now points to unified) */}
              <Route path="/account-selection" element={<Navigate to="/signup" replace />} />

              {/* User Dashboard - role based */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Single sign-in/sign-up system — legacy auth entry points consolidate here */}
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              <Route path="/services/auth" element={<Navigate to="/login" replace />} />
              <Route path="/help/auth" element={<Navigate to="/login" replace />} />
              <Route path="/services/login" element={<Navigate to="/login" replace />} />
              <Route path="/business/login" element={<Navigate to="/login" replace />} />
              <Route path="/services/signup" element={<Navigate to="/signup" replace />} />
              <Route path="/business/signup" element={<Navigate to="/signup" replace />} />
              <Route path="/become-a-business-owner" element={<Navigate to="/signup" replace />} />

              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPassword />
                  </PublicOnlyRoute>
                }
              />

              {/* Backward compatibility redirects */}
              <Route path="/register" element={<Navigate to="/signup" replace />} />

              {/* Business Portal (public landing for business owners) */}
              <Route path="/business" element={<BusinessPortal />} />

              {/* Multi-step business registration wizard (frontend-only) */}
              <Route path="/business/register" element={<BusinessRegistration />} />
              <Route path="/business/onboarding" element={<Navigate to="/business/register" replace />} />

              {/* Provider onboarding (upgrade existing account) */}
              <Route path="/provider/onboarding" element={<ProtectedRoute><ProviderOnboarding /></ProtectedRoute>} />

              {/* Provider workspace (requires service_provider role) */}
              <Route path="/provider" element={<ProviderRoute><ProviderLayout /></ProviderRoute>}>
                <Route index element={<ProviderDashboard />} />
                <Route path="dashboard" element={<ProviderDashboard />} />
                <Route path="profile" element={<ProviderProfile />} />
                <Route path="services" element={<ProviderServices />} />
                <Route path="requests" element={<ProviderRequests />} />
              </Route>

              {/* Protected user routes (legacy) */}
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/notifications" element={<SettingsNotifications />} />
                <Route path="/settings/appearance" element={<SettingsAppearance />} />
                <Route path="/settings/privacy" element={<SettingsPrivacy />} />
                <Route path="/settings/security" element={<SettingsSecurity />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/saved" element={<SavedBusinesses />} />
                <Route path="/favorites" element={<SavedBusinesses />} />

                {/* Job Seeker routes */}
                <Route element={<ProtectedRoute><JobSeekerLayout /></ProtectedRoute>}>
                  <Route index element={<JobSeekerDashboard />} />
                </Route>

                {/* Unified account & service-request routes */}
                <Route path="/account" element={<AccountPage />} />
                <Route path="/my-requests" element={<MyRequests />} />

                {/* Hidden transaction features - Coming Soon pages */}
                <Route path="/messages" element={<ComingSoon feature="Messages" description="Direct messages from businesses and support are being developed. You'll be able to chat securely from this dashboard." />} />
                <Route path="/wallet" element={<ComingSoon feature="Wallet" description="Wallet functionality is being developed. You'll be able to manage funds, track transactions, and make payments securely." />} />
                <Route path="/wallet/fund" element={<ComingSoon feature="Wallet Funding" description="Add funds to your wallet using multiple payment methods." />} />
                <Route path="/wallet/transactions" element={<ComingSoon feature="Wallet Transactions" description="View your complete transaction history." />} />
                <Route path="/transactions" element={<ComingSoon feature="Transactions" description="View all your platform transactions in one place." />} />
                <Route path="/transactions/:id" element={<ComingSoon feature="Transaction Details" description="View detailed information about a specific transaction." />} />

                {/* Affiliate/Share & Earn routes - Coming Soon */}
                <Route path="/affiliate" element={<ComingSoon feature="Affiliate Dashboard" description="Track your referrals, earnings, and withdrawals." />} />
                <Route path="/affiliate/referrals" element={<ComingSoon feature="Referrals" description="View and manage your referral network." />} />
                <Route path="/affiliate/earnings" element={<ComingSoon feature="Earnings" description="Track your affiliate earnings and commissions." />} />
                <Route path="/affiliate/withdrawals" element={<ComingSoon feature="Withdrawals" description="Request withdrawals of your affiliate earnings." />} />

              </Route>

              {/* Services hub — find & request local services (customer-facing) */}
              <Route path="/services" element={<ServiceDiscovery />} />
              <Route path="/services/request" element={<ServiceRequest />} />
              <Route element={<ServicesRoute><Outlet /></ServicesRoute>}>
                <Route path="/services/dashboard" element={<ServicesDashboard />} />
                <Route path="/services/data" element={<ComingSoon feature="Data Bundles" description="Buy internet data bundles for all networks." />} />
                <Route path="/services/airtime" element={<ComingSoon feature="Airtime Recharge" description="Recharge airtime for all Nigerian networks instantly." />} />
                <Route path="/services/electricity" element={<ComingSoon feature="Electricity Bills" description="Pay electricity bills for all distribution companies." />} />
                <Route path="/services/tv" element={<ComingSoon feature="TV Subscriptions" description="Renew your cable TV subscriptions (DStv, GOtv, Startimes)." />} />
                <Route path="/services/education" element={<ComingSoon feature="Education Payments" description="Pay school fees, exam fees, and other education expenses." />} />
                <Route path="/services/recharge-pin" element={<ComingSoon feature="Recharge PIN" description="Buy recharge card PINs for all networks." />} />
                <Route path="/services/digital-products" element={<ComingSoon feature="Digital Products" description="Purchase digital goods and subscriptions." />} />
                <Route path="/services/games" element={<ComingSoon feature="Games & Entertainment" description="Buy game credits, gift cards, and entertainment subscriptions." />} />
                <Route path="/services/social-media" element={<ComingSoon feature="Social Media Services" description="Boost your social media presence with followers, likes, and views." />} />
                <Route path="/services/wallet" element={<ComingSoon feature="Wallet" description="Manage your funds and transactions." />} />
                <Route path="/services/wallet/fund" element={<ComingSoon feature="Wallet Funding" description="Add funds to your wallet." />} />
                <Route path="/services/transactions" element={<ComingSoon feature="Transactions" description="View your transaction history." />} />
                <Route path="/services/profile" element={<Profile />} />
              </Route>

              {/* Business owner frontend preview routes */}
              <Route path="/business/dashboard" element={<BusinessDashboard />} />
              <Route path="/business/profile" element={<BusinessDashboard />} />
              <Route path="/business/services" element={<BusinessDashboard />} />
              <Route path="/business/photos" element={<BusinessDashboard />} />
              <Route path="/business/reviews" element={<BusinessDashboard />} />
              <Route path="/business/enquiries" element={<BusinessDashboard />} />
              <Route path="/business/messages" element={<Navigate to="/business/enquiries" replace />} />
              <Route path="/business/analytics" element={<BusinessDashboard />} />
              <Route path="/business/verification" element={<BusinessDashboard />} />
              <Route path="/business/settings" element={<BusinessDashboard />} />

              {/* Legacy owner / business-office dashboards consolidated into the single Business Dashboard */}
              <Route path="/owner/dashboard" element={<Navigate to="/business/dashboard" replace />} />
              <Route path="/owner/listings" element={<Navigate to="/business/dashboard" replace />} />
              <Route path="/owner/add-business" element={<Navigate to="/business/register" replace />} />
              <Route path="/owner/listings/:id/edit" element={<Navigate to="/business/dashboard" replace />} />
              <Route path="/business-office" element={<Navigate to="/business/dashboard" replace />} />
              <Route path="/business-office/profile" element={<Navigate to="/business/dashboard" replace />} />
              <Route path="/business-office/work" element={<Navigate to="/business/dashboard" replace />} />
              <Route path="/business-office/jobs" element={<Navigate to="/business/dashboard" replace />} />

              {/* Admin frontend preview routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/businesses" element={<AdminLayout><AdminBusinesses /></AdminLayout>} />
              <Route path="/admin/listings" element={<Navigate to="/admin/businesses" replace />} />
              <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
              <Route path="/admin/verification" element={<AdminLayout><AdminVerification /></AdminLayout>} />
              <Route path="/admin/jobs" element={<AdminLayout><AdminJobs /></AdminLayout>} />
              <Route path="/admin/job-categories" element={<AdminLayout><AdminJobCategories /></AdminLayout>} />
              <Route path="/admin/community" element={<AdminLayout><AdminCommunity /></AdminLayout>} />
              <Route path="/admin/help" element={<AdminLayout><AdminHelp /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
              <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

                {/* Help/Community Support routes - nested under shared layout */}
                <Route path="/help" element={<HelpLayout />}>
                  <Route index element={<HelpLandingPage />} />
                  <Route path="categories" element={<HelpLandingPage />} />
                  <Route path="requests" element={<HelpRequestsPage />} />
                  <Route path="requests/:id" element={<SupportRequestDetailsPage />} />
                  <Route path="request/:id" element={<SupportRequestDetailsPage />} />
                  <Route
                    path="request"
                    element={
                      <ProtectedRoute>
                        <RequestHelpPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="request/success"
                    element={
                      <ProtectedRoute>
                        <RequestSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

              {/* Legal pages */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
