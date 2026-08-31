import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { formatRelativeTime, formatDate } from './utils'
import type { CommunityComment } from '../../types/community'

interface CommentsProps {
  reportId: string
  comments: CommunityComment[]
  currentUserId?: string
  onAddComment: (content: string) => Promise<void>
  loading?: boolean
}

export function CommunityComments({
  reportId,
  comments,
  currentUserId,
  onAddComment,
  loading = false,
}: CommentsProps) {
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    try {
      await onAddComment(newComment.trim())
      setNewComment('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="comments" aria-labelledby="comments-heading">
      <h3 className="comments__heading" id="comments-heading">
        <MessageCircle size={20} aria-hidden="true" />
        Comments ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <div className="comments__empty">
          <p>No comments yet. Be the first to share your observations.</p>
        </div>
      ) : (
        <ul className="comments__list" role="list">
          {comments.map((comment) => {
            const isCurrentUser = currentUserId && comment.authorId === currentUserId
            return (
              <li key={comment.id} className="comment">
                <div className="comment__avatar">
                  {comment.authorAvatar ? (
                    <img src={comment.authorAvatar} alt={comment.authorName} loading="lazy" />
                  ) : (
                    <span className="comment__avatar--placeholder">
                      {comment.authorName?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div className="comment__body">
                  <div className="comment__header">
                    <span className="comment__author">
                      {comment.authorName}
                      {isCurrentUser && <span className="comment__you-badge">You</span>}
                    </span>
                    <time className="comment__time" dateTime={comment.createdAt}>
                      {formatRelativeTime(comment.createdAt)}
                    </time>
                  </div>
                  <p className="comment__content">{comment.content}</p>
                  <time className="comment__date" dateTime={comment.createdAt}>
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          maxLength={500}
          disabled={submitting}
          aria-label="Comment"
        />
        <button type="submit" disabled={!newComment.trim() || submitting} aria-label="Send comment">
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}
