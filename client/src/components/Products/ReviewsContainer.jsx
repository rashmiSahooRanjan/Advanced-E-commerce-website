import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, postReview } from "../../store/slices/productSlice";
import { Star, Trash2 } from "lucide-react";

const ReviewsContainer = ({ product, productReviews }) => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);

  const { isReviewDeleting, isPostingReview } = useSelector(
    (state) => state.product,
  );

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    dispatch(
      postReview({
        productId: product.id,
        review: {
          rating,
          comment,
        },
      }),
    );

    setRating(0);
    setHoveredRating(0);
    setComment("");
  };

  return (
    <div className="space-y-10">

      {/* write review */}
      {authUser && (
        <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-border bg-background p-6">

          <h3 className="text-xl font-semibold text-foreground mb-5">
            Leave a Review
          </h3>


          {/* stars */}
          <div className="flex items-center gap-2 mb-5">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(i + 1)}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    i < (hoveredRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>


          {/* comment */}
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary resize-none mb-5"
          />


          {/* submit */}
          <button
            type="submit"
            disabled={isPostingReview || !rating || !comment.trim()}
            className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPostingReview ? "Submitting..." : "Submit Review"}
          </button>

        </form>
      )}


      {/* reviews */}
      <div>

        <h3 className="text-2xl font-semibold text-foreground mb-6">
          Customer Reviews
        </h3>


        {productReviews?.length > 0 ? (
          <div className="space-y-5">

            {productReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-border bg-background p-6"
              >

                <div className="flex gap-4">

                  {/* avatar */}
                  <img
                    src={review?.reviewer?.avatar || "/avatar-holder.avif"}
                    alt={review?.reviewer?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />


                  <div className="flex-1">

                    {/* name + stars */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">

                      <h4 className="font-semibold text-foreground">
                        {review?.reviewer?.name}
                      </h4>


                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>

                    </div>


                    {/* comment */}
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>


                    {/* delete */}
                    {authUser?.id === review?.reviewer?.id && (
                      <button
                        onClick={() =>
                          dispatch(
                            deleteReview({
                              productId: product.id,
                              reviewId: review.id,
                            }),
                          )
                        }
                        className="mt-4 flex items-center gap-2 text-sm text-red-500 hover:opacity-80 transition-all"
                      >
                        {isReviewDeleting ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete Review
                          </>
                        )}
                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-background p-10 text-center">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default ReviewsContainer;