// Helper function to create URL-friendly slugs
export const createSlug = ({title}) => {
  return title
    ?.toLowerCase()
    ?.replace(/[^\w\s-]/g, '') // Remove special characters
    ?.replace(/\s+/g, '-')     // Replace spaces with hyphens
    ?.trim();
};