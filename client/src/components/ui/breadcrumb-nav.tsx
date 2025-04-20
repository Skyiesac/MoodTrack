import { useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "./breadcrumb";
import { ChevronRight } from "lucide-react";

const pathToTitle: Record<string, string> = {
  '/': 'Home',
  '/new': 'New Entry',
  '/settings': 'Settings'
};

export function BreadcrumbNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const paths = pathSegments.map((_, index) => 
    '/' + pathSegments.slice(0, index + 1).join('/')
  );

  if (location.pathname === '/') return null;

  return (
    <Breadcrumb className="py-4">
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      {paths.map((path) => (
        <BreadcrumbItem key={path}>
          <ChevronRight className="h-4 w-4" />
          <BreadcrumbLink href={path}>
            {pathToTitle[path] || path.split('/').pop()}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
