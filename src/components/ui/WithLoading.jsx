import { Skeleton } from "./Skeleton"; // Make sure the path is correct

export function WithLoading({
  isLoading,
  skeleton, // This is for when you *do* want a specific structural skeleton (e.g., <DashboardSkeleton />)
  children,
  // This is the generic default skeleton that will be used if 'skeleton' prop is NOT provided

}) {
  if (isLoading) 
    return skeleton;
  
  return children; // Render the actual content when not loading
}
