import { Link } from 'react-router-dom'
import './RelatedApprovalWork.css'

type RelatedItem = {
  label: string
  to: string
  type: string
}

type Props = {
  items: RelatedItem[]
}

export default function RelatedApprovalWork({ items }: Props) {
  return (
    <div className="related-approval-work">
      {items.map((item) => (
        <Link key={item.label} to={item.to} className="related-approval-item">
          <span>{item.type}</span>
          <strong>{item.label}</strong>
        </Link>
      ))}
    </div>
  )
}
