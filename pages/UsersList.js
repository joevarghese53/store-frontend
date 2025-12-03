import React, { useState, useEffect } from "react";
import { FaTrash, FaTimes, FaUser, FaEnvelope, FaCrown, FaEdit, FaSave, FaUsers } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  //Delete user handler
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setEditableUserName("");
    setEditableUserEmail("");
  };

  return (
    <div className="user-list-main-container">
      <div className="user-list-card">
        <div className="user-list-header">
          <div className="user-list-title">
            <FaUsers className="user-list-icon" />
            <h1>User Management</h1>
          </div>
          <p className="user-list-subtitle">Manage user accounts, permissions, and information</p>
        </div>

        {isLoading ? (
          <div className="user-list-loading">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">{error?.data?.message?.message || error.error}</Message>
        ) : (
          <div className="user-list-content">
            <div className="user-stats">
              <div className="user-stat-item">
                <span className="user-stat-number">{users?.length || 0}</span>
                <span className="user-stat-label">Total Users</span>
              </div>
              <div className="user-stat-item">
                <span className="user-stat-number">
                  {users?.filter(user => user.isAdmin).length || 0}
                </span>
                <span className="user-stat-label">Admins</span>
              </div>
              <div className="user-stat-item">
                <span className="user-stat-number">
                  {users?.filter(user => !user.isAdmin).length || 0}
                </span>
                <span className="user-stat-label">Regular Users</span>
              </div>
            </div>

            <div className="user-grid">
              {users?.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-card-header">
                    <div className="user-avatar">
                      <FaUser className="user-avatar-icon" />
                    </div>
                    <div className="user-admin-badge">
                      {user.isAdmin && <FaCrown className="admin-icon" title="Admin" />}
                    </div>
                  </div>

                  <div className="user-card-content">
                    <div className="user-info-section">
                      <label className="user-info-label">Name</label>
                      {editableUserId === user._id ? (
                        <div className="user-edit-input-group">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="user-edit-input"
                            placeholder="Enter name"
                          />
                        </div>
                      ) : (
                        <div className="user-info-value">{user.username}</div>
                      )}
                    </div>

                    <div className="user-info-section">
                      <label className="user-info-label">Email</label>
                      {editableUserId === user._id ? (
                        <div className="user-edit-input-group">
                          <input
                            type="email"
                            value={editableUserEmail}
                            // onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="user-edit-input"
                            placeholder="Enter email"
                            readOnly
                          />
                        </div>
                      ) : (
                        <div className="user-info-value">
                          <FaEnvelope className="user-email-icon" />
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </div>
                      )}
                    </div>

                    <div className="user-info-section">
                      <label className="user-info-label">Role</label>
                      <div className="user-role-badge">
                        {user.isAdmin ? (
                          <span className="role-admin">
                            <FaCrown className="role-icon" />
                            Admin
                          </span>
                        ) : (
                          <span className="role-user">
                            <FaUser className="role-icon" />
                            User
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="user-card-actions">
                      {editableUserId === user._id ? (
                        <div className="user-edit-actions">
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="user-save-button"
                            title="Save changes"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="user-cancel-button"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="user-actions">
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="user-edit-button"
                            title="Edit user"
                          >
                            <FaEdit />
                          </button>
                          {!user.isAdmin && (
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className="user-delete-button"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {users?.length === 0 && (
              <div className="user-empty-state">
                <FaUsers className="user-empty-icon" />
                <p>No users found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
