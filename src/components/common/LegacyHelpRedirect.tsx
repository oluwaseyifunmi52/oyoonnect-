import { Navigate, useLocation } from 'react-router-dom'

export function LegacyHelpRedirect() {
  const { pathname, search, hash } = useLocation()
  const suffix = pathname.replace(/^\/help\/?/, '')
  const target = suffix ? `/community/help/${suffix}` : '/community/help'

  return <Navigate to={`${target}${search}${hash}`} replace />
}

export default LegacyHelpRedirect
