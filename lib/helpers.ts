import { formatDistanceToNow } from "date-fns";

  // Format date to relative time (e.g., "2 hours ago")
  export const formatDateIntoAgoTimes = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  }; 

  export function getFirstNameFromEmail(email:string) {
    return email.split('@')[0];
}


  // Get initials for avatar fallback
  export const getInitials = (name?: string | null): string => {
    if (!name) return "U";
    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      const firstInitial = nameParts[0].charAt(0);
      const lastInitial = nameParts[nameParts.length - 1].charAt(0);
      return (firstInitial + lastInitial).toUpperCase();
    }
  };