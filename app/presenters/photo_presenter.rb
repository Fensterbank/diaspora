class PhotoPresenter < BasePresenter
  def base_hash
    { id: id,
      guid: guid,
      dimensions: {
        height: height,
        width: width
      },
      sizes: {
        small: url(:thumb_small),
        medium: url(:thumb_medium),
        large: url(:scaled_full)
      },
      status_message: {
        id: status_message.id,
        likes_count: status_message.likes_count,
        comments_count: status_message.comments_count,
        reshares_count: status_message.reshares_count
      }
    }
  end
end
