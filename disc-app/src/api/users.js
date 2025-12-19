const API_BASE_URL = 'https://disc-assignment-5-users-api-iyct.onrender.com';

/**
 * Get all users from the API
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID
 * @param {number} id - The user ID
 * @returns {Promise<Object>} User object
 */
export const getUserByID = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @param {string} userData.firstName
 * @param {string} userData.lastName
 * @param {string} userData.email
 * @param {string} userData.bio
 * @param {string} userData.major
 * @param {string} userData.graduationYear
 * @param {File} userData.image - Profile picture file
 * @returns {Promise<Object>} Created user object
 */
export const createUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('firstName', String(userData.firstName || '').trim());
    formData.append('lastName', String(userData.lastName || '').trim());
    formData.append('email', String(userData.email || '').trim());
    formData.append('bio', String(userData.bio || '').trim());
    formData.append('major', String(userData.major || '').trim());
    formData.append('graduationYear', String(userData.graduationYear || '').trim());

    // Ensure image is always provided
    if (userData.image && userData.image instanceof File) {
      formData.append('image', userData.image);
    } else {
      throw new Error('Image file is required');
    }

    console.log('Creating user with FormData:', {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      hasImage: !!userData.image,
      imageSize: userData.image?.size,
      imageType: userData.image?.type
    });

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('Create user error response:', errorText);

        // Try to parse JSON error if possible
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          // If not JSON, use text or default message
          if (errorText && errorText.length < 500) {
            errorMessage = errorText.trim();
          } else if (response.status === 500) {
            errorMessage = 'Internal Server Error - server could not process the request. Please try again.';
          }
        }
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      throw new Error(errorMessage);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {number} id - The user ID
 * @param {Object} userData - User data object (same structure as createUser)
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = async (id, userData) => {
  try {
    const formData = new FormData();
    formData.append('firstName', String(userData.firstName || '').trim());
    formData.append('lastName', String(userData.lastName || '').trim());
    formData.append('email', String(userData.email || '').trim());
    formData.append('bio', String(userData.bio || '').trim());
    formData.append('major', String(userData.major || '').trim());
    formData.append('graduationYear', String(userData.graduationYear || '').trim());

    // Always append image - API requires it
    if (userData.image && userData.image instanceof File) {
      formData.append('image', userData.image);
    } else {
      // Create a placeholder if no image provided (fallback - shouldn't happen normally)
      throw new Error('Image file is required for update. Please provide an image.');
    }

    console.log('Updating user with FormData:', {
      id,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      hasImage: !!userData.image
    });

    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.error('Update user error response:', errorText);

        // Try to parse JSON error if possible
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          // If not JSON, use text or default message
          if (errorText && errorText.length < 500) {
            errorMessage = errorText.trim();
          } else if (response.status === 500) {
            errorMessage = 'Internal Server Error - server could not process the request. Please try again.';
          }
        }
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      throw new Error(errorMessage);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {number} id - The user ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};
