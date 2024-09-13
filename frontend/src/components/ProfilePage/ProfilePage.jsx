import './ProfilePage.css';
import { fetchUserReviews } from '../../store/reviews';
import { uploadProfileImage, deleteProfileImage } from '../../store/profileImage';
import { updateUserInfo, deleteUserAccount } from '../../store/user';
import { restoreUser } from '../../store/session';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import UploadModal from './UploadModal';
import ReviewModal from './ReviewModal';
import { FaPencilAlt } from 'react-icons/fa'; // Import pencil icon from react-icons

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const userReviews = useSelector((state) => state.reviews.userReviews[user.id]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.display_name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false); // State to control profile editing mode
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // State to track upload status
  const [hasChanges, setHasChanges] = useState(false); // State to track if changes were made

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

  const handleUpload = async (file) => {
    setIsUploading(true);
    setIsModalOpen(false); // Close the modal if it is open
    await dispatch(uploadProfileImage(file));
    await dispatch(restoreUser());
    setIsUploading(false);
  };

  const handleDeleteProfileImage = () => {
    if (window.confirm('Are you sure you want to delete your profile picture?')) {
      dispatch(deleteProfileImage());
    }
  };

  const handleSaveChanges = async () => {
    await dispatch(updateUserInfo({ display_name: editName, bio: editBio }));
    await dispatch(restoreUser());
    setIsEditingProfile(false);
    setHasChanges(false);
  };

  const handleCancelEdit = () => {
    setEditName(user.display_name);
    setEditBio(user.bio || '');
    setIsEditingProfile(false);
    setHasChanges(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      dispatch(deleteUserAccount());
    }
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setIsReviewModalOpen(true);
  };

  const handleReviewUpdate = async () => {
    await dispatch(fetchUserReviews(user.id));
    setIsReviewModalOpen(false);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="blue" size={50} />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="ProfilePage-Main">
      <div className="Profile-Header">
        <div className="Profile-Image-Container">
          {isUploading ? (
            <ClipLoader color="blue" size={50} />
          ) : (
            <img src={user?.profile_picture || '/profile.jpg'} alt="Profile" className="profile-img" />
          )}
        </div>

        <div className="Profile-Info">
          {isEditingProfile ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={handleInputChange(setEditName)}
                maxLength={30}
                autoFocus
                className="edit-input"
              />
              <textarea
                value={editBio}
                onChange={handleInputChange(setEditBio)}
                maxLength={150}
                className="edit-bio"
              />
              <p className="member-since">Member Since: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric' })}</p>
              <p>{Object.keys(userReviews).length} Reviews</p>
            </>
          ) : (
            <>
              <h1>{user.display_name}</h1>
              <p className="member-since">Member Since: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric' })}</p>
              <p>{Object.keys(userReviews).length} Reviews</p>
              <p className="bio-text">{editBio || 'Add a bio...'}</p>
            </>
          )}
        </div>

        <div className="Profile-Actions">
          {isEditingProfile ? (
            <>
              <button onClick={() => setIsModalOpen(true)} className="action-btn">Upload Picture</button>
              {hasChanges ? (
                <button onClick={handleSaveChanges} className="save-changes-btn">Save Changes</button>
              ) : (
                <button onClick={handleCancelEdit} className="cancel-btn">Close</button>
              )}
              <button onClick={handleDeleteProfileImage} className="delete-picture-btn">Delete Picture</button>
              <button onClick={handleDeleteAccount} className="delete-account-btn">Delete Account</button>
            </>
          ) : (
            <button className="edit-profile-btn" onClick={() => setIsEditingProfile(true)}>
              <FaPencilAlt style={{ marginRight: '10px' }} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {Object.values(userReviews).map((review) => (
        <div className='ProfilePage-review-tile' key={review.id}>
          <div className='ProfilePage-review-header'>
            <h3>{review.Product.name}</h3>
            <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="review-content">
            <p>{review.content}</p>
          </div>
          <button className="edit-review-btn" onClick={() => handleEditReview(review)}>Edit Review</button>
        </div>
      ))}

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />

      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productId={reviewToEdit?.product_id}
          onReviewUpdate={handleReviewUpdate}
        />
      )}
    </div>
  );
}

export default ProfilePage;
