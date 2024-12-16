import { IItem } from "@/models/itemModel";

export const getItems = async () => {
    try {
      const response = await fetch(`/api/items`, {
        method: 'GET',
        credentials: 'same-origin',
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch items');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

export const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete item');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  };
  
  
  export const getFilteredItems = async (query: string): Promise<IItem[]> => {
    try {
        const response = await fetch(`/api/items/search?query=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch filtered items');
        }
  
        const items: IItem[] = await response.json();
        return items;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred.');
    }
  };