import { Link } from 'react-router'

// Admin-entered links: pages on this site use the router, full https links open in a new tab.
export default function SmartLink({ to, children, ...props }) {
  if (/^https?:\/\//.test(to)) {
    return (
      <a href={to} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  )
}
