import React, { useState, useEffect } from 'react';
import { FaLock, FaArrowLeft, FaUser, FaEnvelope, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PasswordSettings.css';

const PasswordSettings = ({ onBack }) => {
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    studentId: '',
    year: 1,
    branch: 'CSE',
    section: 'A'
  });
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState(null);
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    setProfile({
      name: userData.studentName || '',
      email: userData.email || '',
      studentId: userData.sid || '',
      year: userData.year || 1,
      branch: userData.branch || 'CSE',
      section: userData.section || 'A'
    });
  }, []);

  // Reset token when component unmounts or user goes back
  useEffect(() => {
    if (!showForgotPassword) {
      setResetToken(null);
    }
  }, [showForgotPassword]);
  
  // Handle profile field changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
        toast.success('Please enter your new password');
      } else {
        toast.success('Password reset link sent to your email');
        setShowForgotPassword(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const updatedUser = {
        ...userData,
        studentName: profile.name,
        email: profile.email,
        sid: profile.studentId,
        year: parseInt(profile.year, 10),
        branch: profile.branch,
        section: profile.section
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      
      // Update parent component if needed
      if (window.updateUserData) {
        window.updateUserData(updatedUser);
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="settings-container">
      <button onClick={onBack} className="back-button">
        <FaArrowLeft /> Back to Dashboard
      </button>
      
      <div className="settings-card">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FaLock /> Password
          </button>
        </div>
        
        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <h2><FaUser /> Edit Profile</h2>
            
            <div className="form-group">
              <label><FaUser /> Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label><FaIdCard /> Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={profile.studentId}
                  onChange={handleProfileChange}
                  required
                  placeholder="Enter student ID"
                />
              </div>
              
              <div className="form-group">
                <label><FaCalendarAlt /> Year</label>
                <select
                  name="year"
                  value={profile.year}
                  onChange={handleProfileChange}
                  className="form-control"
                >
                  {[1, 2, 3, 4].map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <select
                  name="branch"
                  value={profile.branch}
                  onChange={handleProfileChange}
                  className="form-control"
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Section</label>
                <select
                  name="section"
                  value={profile.section}
                  onChange={handleProfileChange}
                  className="form-control"
                >
                  {['A', 'B', 'C', 'D'].map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        ) : (
          <div className="password-section">
            <h2><FaLock /> Change Password</h2>
            {!showForgotPassword && !resetToken ? (
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="8"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
                
                <div className="forgot-password-link">
                  <button 
                    type="button" 
                    className="text-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            ) : (
              <form 
                onSubmit={resetToken ? handlePasswordChange : handleForgotPassword} 
                className="forgot-password-form"
              >
                {!resetToken ? (
                  <>
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                    
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setEmail('');
                      }}
                    >
                      Back to Login
                    </button>
                  </>
                ) : (
                  <>
                    <p>Please enter your new password.</p>
                    
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength="8"
                        placeholder="Enter new password (min 8 characters)"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordSettings;
