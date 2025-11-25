/**
 * Calculate time remaining until auction ends
 * @param endDate - The end date/time of the auction
 * @returns Formatted string showing time remaining (e.g., "2d 15h 30m", "3h 45m", "30m", "Ended")
 */
export const getTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return "Ended";
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  // More than 1 day: show days and hours
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  
  // Less than 1 day but more than 1 hour: show hours and minutes
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  // Less than 1 hour: show only minutes
  return `${minutes}m`;
};
