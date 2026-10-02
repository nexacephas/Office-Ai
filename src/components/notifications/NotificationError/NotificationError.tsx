import NotificationIcon from '../NotificationIcon'
import './NotificationError.css'

export default function NotificationError({ onRetry }: { onRetry: () => void }) {
  return <div className="notification-error" role="alert"><span className="notification-error-icon"><NotificationIcon name="refresh" size={19} /></span><h2>Notifications couldn't be loaded.</h2><p>Your activity is still here. Try loading it again.</p><button type="button" onClick={onRetry}><NotificationIcon name="refresh" size={15} /> Try again</button></div>
}