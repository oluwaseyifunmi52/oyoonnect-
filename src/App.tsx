import { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute, ServicesRoute, ProviderRoute } from './components/common'
import { LegacyHelpRedirect } from './components/common/LegacyHelpRedirect'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { AdminLayout } from './components/admin/AdminLayout'
import { Layout } from './components/Layout'
import { JobsLayout } from './layouts/JobsLayout'
import { CommunityLayout } from './layouts/CommunityLayout'
import { BusinessLayout } from './layouts/BusinessLayout'
import { UserLayout } from './layouts/UserLayout'
import { ServicesCustomerLayout } from './layouts/ServicesCustomerLayout'
import { WalletLayout } from './layouts/WalletLayout'
import { AffiliateLayout } from './layouts/AffiliateLayout'
import { MessagesLayout } from './layouts/MessagesLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAuth } from './context/AuthContext'
const MessagesLandingPage = lazy(() => import('./pages/MessagesLandingPage'))
const ConversationPage = lazy(() => import('./pages/ConversationPage'))
const WatchExperience = lazy(() => import('./pages/watch/WatchExperience'))

const Home = lazy(() => import('./pages/Home'))
const HomeSearchResults = lazy(() => import('./pages/HomeSearchResults'))
const HomeBrowsePages = lazy(() => import('./pages/HomeBrowsePages'))
const BusinessesPage = lazy(() => import('./pages/businesses/BusinessesPage'))
const BusinessProfile = lazy(() => import('./pages/BusinessProfile'))
const ListBusiness = lazy(() => import('./pages/ListBusiness'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const SavedBusinesses = lazy(() => import('./pages/SavedBusinesses'))
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'))
const Settings = lazy(() => import('./pages/Settings'))
const SettingsNotifications = lazy(() => import('./pages/SettingsNotifications'))
const SettingsAppearance = lazy(() => import('./pages/SettingsAppearance'))
const SettingsPrivacy = lazy(() => import('./pages/SettingsPrivacy'))
const SettingsSecurity = lazy(() => import('./pages/SettingsSecurity'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotificationsWorkspace = lazy(() => import('./pages/NotificationsWorkspace'))
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
const AdminProviders = lazy(() => import('./pages/admin/AdminProviders'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminServiceRequests = lazy(() => import('./pages/admin/AdminServiceRequests'))
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'))
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'))
const AdminPayouts = lazy(() => import('./pages/admin/AdminPayouts'))
const AdminJobApplications = lazy(() => import('./pages/admin/AdminJobApplications'))
const AdminCommunityModeration = lazy(() => import('./pages/admin/AdminCommunityModeration'))
const Categories = lazy(() => import('./pages/Categories'))

const BusinessPortal = lazy(() => import('./pages/BusinessPortal'))
const BusinessRegistration = lazy(() => import('./pages/BusinessRegistration'))
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'))
const UserDashboard = lazy(() => import('./pages/UserDashboard'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

const AccountPage = lazy(() => import('./pages/AccountPage'))
const ProviderOnboarding = lazy(() => import('./pages/provider/ProviderOnboarding'))
const ProviderLayout = lazy(() => import('./pages/provider/ProviderLayout'))
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard'))
const ProviderProfile = lazy(() => import('./pages/provider/ProviderProfile'))
const ProviderServices = lazy(() => import('./pages/provider/ProviderServices'))
const ProviderRequests = lazy(() => import('./pages/provider/ProviderRequests'))
const ServiceDiscovery = lazy(() => import('./pages/services/ServiceDiscovery'))
const ServiceUnavailablePage = lazy(() => import('./pages/services/ServiceUnavailablePage'))
const ServicesTransactions = lazy(() => import('./pages/services/ServicesTransactions'))
const ServicesWallet = lazy(() => import('./pages/services/ServicesWallet'))
const ServicesProfile = lazy(() => import('./pages/services/ServicesProfile'))
const ServiceRequest = lazy(() => import('./pages/services/ServiceRequest'))
const MyRequests = lazy(() => import('./pages/services/MyRequests'))

const Unauthorized = lazy(() => import('./pages/Unauthorized'))

const JobsListing = lazy(() => import('./pages/jobs/JobsListing'))
const JobDetail = lazy(() => import('./pages/jobs/JobDetail'))
const PostJob = lazy(() => import('./pages/jobs/PostJob'))
const InterviewSchedule = lazy(() => import('./pages/jobs/InterviewSchedule'))

const JobSeekerDashboard = lazy(() => import('./pages/job-seeker/JobSeekerDashboard'))
const JobSeekerLayout = lazy(() => import('./pages/job-seeker/JobSeekerLayout'))

const ComingSoon = lazy(() => import('./pages/ComingSoon'))

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
const VTUPurchase = lazy(() => import('./pages/VTUPurchase'))

const Wallet = lazy(() => import('./pages/Wallet'))
const WalletFund = lazy(() => import('./pages/WalletFund'))
const WalletTransactions = lazy(() => import('./pages/WalletTransactions'))
const Transactions = lazy(() => import('./pages/Transactions'))
const TransactionDetail = lazy(() => import('./pages/TransactionDetail'))

const AffiliateDashboard = lazy(() => import('./pages/affiliate/AffiliateDashboard'))
const AffiliateReferrals = lazy(() => import('./pages/affiliate/Referrals'))
const AffiliateEarnings = lazy(() => import('./pages/affiliate/Earnings'))
const AffiliateWithdrawals = lazy(() => import('./pages/affiliate/Withdrawals'))

const CommunityHome = lazy(() => import('./pages/community/CommunityHome'))
const CommunityCategoryPage = lazy(() => import('./pages/community/CommunityCategoryPage'))
const CommunityReportForm = lazy(() => import('./pages/community/CommunityReportForm'))
const CommunityReportDetail = lazy(() => import('./pages/community/CommunityReportDetail'))

const HelpLandingPage = lazy(() => import('./pages/help/HelpLandingPage'))
import DashboardPage from './pages/DashboardPage'
const HelpRequestsPage = lazy(() => import('./pages/help/HelpRequestsPage'))
const RequestHelpPage = lazy(() => import('./pages/help/RequestHelpPage'))
const RequestSuccessPage = lazy(() => import('./pages/help/RequestSuccessPage'))
const SupportRequestDetailsPage = lazy(() => import('./pages/help/SupportRequestDetailsPage'))
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

function JobsRouteLayout() {
  const { isServiceProvider } = useAuth()
  return isServiceProvider
    ? <DashboardLayout navigationMode="provider" showWorkspaceSwitcher><JobsListing /></DashboardLayout>
    : <DashboardLayout><JobsListing /></DashboardLayout>
}

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <ErrorBoundary>
          <Routes>
            {/* Home dashboard has its own responsive navigation shell. */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<HomeSearchResults />} />
            <Route path="/nearby" element={<HomeBrowsePages variant="nearby" />} />
            <Route path="/marketplace" element={<HomeBrowsePages variant="marketplace" />} />

            {/* APP LAYOUT - All pages with single Navbar */}
            <Route element={<Layout />}>
              <Route path="/watch/*" element={<WatchExperience />} />
              <Route path="/business/:id" element={<BusinessProfile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/list-business" element={<ListBusiness />} />

              {/* Auth pages - public */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Navigate to="/login" replace />} />
              <Route path="/account-selection" element={<Navigate to="/signup" replace />} />
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
              <Route path="/business/register" element={<BusinessRegistration />} />
              <Route path="/business/onboarding" element={<Navigate to="/business/register" replace />} />

              {/* Provider onboarding (upgrade existing account) */}
              <Route path="/provider/onboarding" element={<ProtectedRoute><ProviderOnboarding /></ProtectedRoute>} />
            </Route>

{/* JOBS LISTING uses the shared dashboard shell. */}
            <Route path="/jobs" element={<JobsRouteLayout />} />

            {/* POST A JOB - Business owner only, uses dashboard layout */}
            <Route
              path="/jobs/post"
              element={
                <ProtectedRoute allowedRoles={['business_owner']}>
                  <DashboardLayout navigationMode="provider" showWorkspaceSwitcher workspaceKey="business_owner">
                    <PostJob />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route element={<DashboardLayout />}>
              <Route path="/businesses" element={<BusinessesPage />} />
              <Route path="/community" element={<CommunityHome />} />
            </Route>

            {/* Job detail and interview routes retain their existing layout. */}
            <Route element={<JobsLayout />}>
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/:jobId/applicants/:applicationId/interview/schedule" element={<ProtectedRoute><InterviewSchedule /></ProtectedRoute>} />
            </Route>

            {/* LIST YOUR BUSINESS - Any authenticated user, uses user dashboard layout */}
            <Route
              path="/list-business"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <ListBusiness />
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            {/* COMMUNITY LAYOUT - Community features */}
            <Route element={<CommunityLayout />}>
              <Route path="/community/events" element={<HomeBrowsePages variant="events" />} />
              <Route path="/community/events/:id" element={<HomeBrowsePages variant="events" />} />
              <Route path="/community/report/:id" element={<CommunityReportDetail />} />
              <Route path="/community/:categorySlug" element={<CommunityCategoryPage />} />

              <Route path="/community/wallet" element={<Navigate to="/wallet" replace />} />
              <Route path="/community/wallet/fund" element={<Navigate to="/wallet/fund" replace />} />
              <Route path="/community/wallet/transactions" element={<Navigate to="/wallet/transactions" replace />} />
            </Route>

            {/* REPORT AN ISSUE - Any authenticated user, uses user dashboard layout */}
            <Route
              path="/community/report"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <CommunityReportForm />
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            <Route element={<ProtectedRoute><WalletLayout /></ProtectedRoute>}>
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/fund" element={<WalletFund />} />
              <Route path="/wallet/transactions" element={<WalletTransactions />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/:id" element={<TransactionDetail />} />
            </Route>

            {/* HELP LAYOUT - Help & Support section */}
            <Route path="/community/help" element={<HelpLayout />}>
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

            {/* DASHBOARD LAYOUT - Main civic dashboard */}
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>

            {/* Backward compatibility redirects for old /help/* routes */}
            <Route path="/help" element={<Navigate to="/community/help" replace />} />
            <Route path="/wallet/*" element={<Navigate to="/wallet" replace />} />

            {/* SERVICES CUSTOMER LAYOUT - Customer-facing services */}
            <Route element={<ServicesCustomerLayout />}>
              <Route path="/services" element={<ServiceDiscovery />} />
              <Route path="/services/request" element={<ServiceRequest />} />
              <Route element={<ServicesRoute><Outlet /></ServicesRoute>}>
                <Route path="/services/dashboard" element={<ServiceDiscovery />} />
                <Route path="/services/data" element={<VTUPurchase type="data" />} />
                <Route path="/services/airtime" element={<VTUPurchase type="airtime" />} />
                <Route path="/services/electricity" element={<ServiceUnavailablePage feature="Electricity payments" description="Paying a utility bill requires a live disco and meter verification provider. That integration is not configured in this project yet." />} />
                <Route path="/services/tv" element={<ServiceUnavailablePage feature="TV subscriptions" description="TV subscription checkout needs a connected provider for smartcard verification and current packages. That integration is not configured yet." />} />
                <Route path="/services/education" element={<ServiceUnavailablePage feature="Education payments" description="Education products and candidate verification are not connected to a live provider yet." />} />
                <Route path="/services/recharge-pin" element={<ServiceUnavailablePage feature="Recharge PIN" description="Recharge PIN availability, denominations, delivery, and secure PIN display require a connected provider that is not configured yet." />} />
                <Route path="/services/digital-products" element={<ServiceUnavailablePage feature="Digital products" description="There is no live product catalog or delivery provider connected for digital products yet." />} />
                <Route path="/services/games" element={<ServiceUnavailablePage feature="Games and entertainment" description="Game credits, gift cards, and subscription products require a connected catalog and fulfillment provider that is not configured yet." />} />
                <Route path="/services/social-media" element={<ServiceUnavailablePage feature="Social media services" description="There is no connected provider for social media packages, order tracking, or delivery status yet." />} />
                <Route path="/services/wallet" element={<ServicesWallet />} />
                <Route path="/services/wallet/fund" element={<ServiceUnavailablePage feature="Wallet funding" description="A production wallet funding or virtual-account provider is not connected here yet. You can choose Paystack during supported data or airtime purchases." />} />
                <Route path="/services/transactions" element={<ServicesTransactions />} />
                <Route path="/services/profile" element={<ServicesProfile><ProfileSettings /></ServicesProfile>} />
              </Route>
            </Route>

            {/* BUSINESS LAYOUT - Business owner dashboard/workspace */}
            <Route element={<ProtectedRoute><BusinessLayout /></ProtectedRoute>}>
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
            </Route>

            {/* USER LAYOUT - User dashboard/profile/settings */}
            <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/profile" element={<ProfileSettings />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/notifications" element={<SettingsNotifications />} />
              <Route path="/settings/appearance" element={<SettingsAppearance />} />
              <Route path="/settings/privacy" element={<SettingsPrivacy />} />
              <Route path="/settings/security" element={<SettingsSecurity />} />
              <Route path="/saved" element={<SavedBusinesses />} />
              <Route path="/favorites" element={<SavedBusinesses />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/my-requests" element={<MyRequests />} />
            </Route>

            {/* Notifications use the active account workspace while sharing one page and data source. */}
            <Route path="/notifications" element={<ProtectedRoute><NotificationsWorkspace /></ProtectedRoute>} />

            {/* AFFILIATE LAYOUT - Affiliate/Share & Earn */}
            <Route element={<ProtectedRoute><AffiliateLayout /></ProtectedRoute>}>
              <Route path="/affiliate" element={<ComingSoon feature="Affiliate Dashboard" description="Track your referrals, earnings, and withdrawals." />} />
              <Route path="/affiliate/referrals" element={<ComingSoon feature="Referrals" description="View and manage your referral network." />} />
              <Route path="/affiliate/earnings" element={<ComingSoon feature="Earnings" description="Track your affiliate earnings and commissions." />} />
              <Route path="/affiliate/withdrawals" element={<ComingSoon feature="Withdrawals" description="Request withdrawals of your affiliate earnings." />} />
            </Route>

            {/* MESSAGES LAYOUT - Messages */}
            <Route element={<ProtectedRoute><MessagesLayout /></ProtectedRoute>}>
              <Route path="/messages" element={<MessagesLandingPage />} />
              <Route path="/messages/:conversationId" element={<ConversationPage />} />
            </Route>

            {/* PROVIDER WORKSPACE - Service provider workspace */}
            <Route path="/provider" element={<ProviderRoute><ProviderLayout /></ProviderRoute>}>
              <Route index element={<ProviderDashboard />} />
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="profile" element={<ProviderProfile />} />
              <Route path="services" element={<ProviderServices />} />
              <Route path="requests" element={<ProviderRequests />} />
            </Route>

            {/* JOB SEEKER WORKSPACE - Job seeker dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'customer']}><JobSeekerLayout /></ProtectedRoute>}>
              <Route path="/job-seeker" element={<JobSeekerDashboard />} />
              <Route index element={<JobSeekerDashboard />} />
            </Route>

            {/* ADMIN LAYOUT - Admin dashboard (already has its own layout) */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/businesses" element={<AdminLayout><AdminBusinesses /></AdminLayout>} />
            <Route path="/admin/listings" element={<Navigate to="/admin/businesses" replace />} />
            <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
            <Route path="/admin/verification" element={<AdminLayout><AdminVerification /></AdminLayout>} />
            <Route path="/admin/jobs" element={<AdminLayout><AdminJobs /></AdminLayout>} />
            <Route path="/admin/job-applications" element={<AdminLayout><AdminJobApplications /></AdminLayout>} />
            <Route path="/admin/job-categories" element={<AdminLayout><AdminJobCategories /></AdminLayout>} />
            <Route path="/admin/community" element={<AdminLayout><AdminCommunity /></AdminLayout>} />
            <Route path="/admin/community/moderation" element={<AdminLayout><AdminCommunityModeration /></AdminLayout>} />
            <Route path="/admin/help" element={<AdminLayout><AdminHelp /></AdminLayout>} />
            <Route path="/admin/payouts" element={<AdminLayout><AdminPayouts /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
            <Route path="/admin/providers" element={<AdminLayout><AdminProviders /></AdminLayout>} />
            <Route path="/admin/services" element={<AdminLayout><AdminServices /></AdminLayout>} />
            <Route path="/admin/service-requests" element={<AdminLayout><AdminServiceRequests /></AdminLayout>} />
            <Route path="/admin/notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
            <Route path="/admin/audit-logs" element={<AdminLayout><AdminAuditLogs /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            {/* Legacy owner / business-office dashboards consolidated */}
            <Route path="/owner/dashboard" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/owner/listings" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/owner/add-business" element={<Navigate to="/business/register" replace />} />
            <Route path="/owner/listings/:id/edit" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/business-office" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/business-office/profile" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/business-office/work" element={<Navigate to="/business/dashboard" replace />} />
            <Route path="/business-office/jobs" element={<Navigate to="/business/dashboard" replace />} />

            {/* Legal pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help/*" element={<LegacyHelpRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
