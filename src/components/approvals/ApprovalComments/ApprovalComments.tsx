import './ApprovalComments.css'

type Comment = {
  time: string
  author: string
  text: string
}

type Props = {
  comments: Comment[]
}

export default function ApprovalComments({ comments }: Props) {
  return (
    <div className="approval-comments">
      {comments.map((comment, index) => (
        <div key={`${comment.author}-${comment.time}-${index}`} className="approval-comment">
          <span>{comment.time}</span>
          <strong>{comment.author}</strong>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  )
}
