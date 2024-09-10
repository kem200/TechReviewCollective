import './ProfilePage.css';

function ProfilePage() {
  return (
    <div className="ProfilePage-Main">
      <div className='Profile-Header'>
        <img src="/profile.jpg" alt="" id='profile-img'/>
        <div className='profile-details'>
        <h1>Mark Pearson</h1>
          <p>9 Reviews</p>
          <p>4 Products Posted</p>
        </div>
        <div className='bio'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus modi repellendus et ullam laudantium explicabo quasi sit similique perferendis inventore nobis exercitationem, beatae dicta dignissimos corporis esse. Laudantium, quia totam.</div>
      </div>

      <div className='ProfilePage-review-tile'>
        
      </div>
    </div>
  );
}

export default ProfilePage;
