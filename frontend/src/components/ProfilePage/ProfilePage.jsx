import './ProfilePage.css';
import { fetchUserReviews } from '../../store/reviews';
import { uploadProfileImage } from '../../store/profileImage'; // Import the thunk for uploading images
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import UploadModal from './UploadModal';

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userReviews = useSelector((state) => state.reviews.userReviews[user.id]);
  const profileImageState = useSelector((state) => state.profileImage); // Get the upload state from Redux

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchUserReviews(user.id));
      } catch (err) {
        setError('Failed to fetch user reviews');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.id) {
      fetchData();
    }
  }, [dispatch, user.id]);

  const handleUpload = (file) => {
    dispatch(uploadProfileImage(file)); // Dispatch the thunk to upload the file
    setIsModalOpen(false); // Close the modal after starting the upload
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="blue" size={50} />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  if (!userReviews || Object.keys(userReviews).length === 0) {
    return <p>No reviews found for this user.</p>;
  }

  return (
    <div className="ProfilePage-Main">
      <div className='Profile-Header'>
        <img src={profileImageState?.imageUrl || '/profile.jpg'} alt="Profile" id='profile-img' />
        <div className='profile-details'>
          <h1>{user.display_name}</h1>
          <p>{Object.keys(userReviews).length} Reviews</p>
          <p>4 Products Posted</p>
        </div>
        <div className='bio'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus modi repellendus et ullam laudantium explicabo quasi sit similique perferendis inventore nobis exercitationem, beatae dicta dignissimos corporis esse. Laudantium, quia totam.
        </div>
        <button onClick={() => setIsModalOpen(true)}>Upload Picture</button>
      </div>

      {Object.values(userReviews).map(review => (
        <div className='ProfilePage-review-tile' key={review.id}>
          <div className='ProfilePage-review-header'>
            <p>Product: {review.Product.name}</p>
            <p>{review.content}</p>
            <p>{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default ProfilePage;
