import { useLocation } from "wouter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbNav() {
  const [location] = useLocation();
  
  // Get path segments and create breadcrumb items
  const segments = location.split('/').filter(Boolean);
  
  // If we're at root, don't show breadcrumbs
  if (segments.length === 0) {
    return null;
  }
  
  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Mood Journal</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);
          
          return (
            <BreadcrumbItem key={path}>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
