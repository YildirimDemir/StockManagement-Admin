export const fetchUserAccounts = async () => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to fetch user accounts');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      throw error; 
    }
};

export const fetchAccountById = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to fetch account');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
};

export const deleteAccountById = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to delete account');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };