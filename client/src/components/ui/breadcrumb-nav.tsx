import { useLocation, Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";
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
    <Breadcrumb className="py-4 flex items-center space-x-2">
      <div className="flex items-center">
        <BreadcrumbItem>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Home
          </Link>
        </BreadcrumbItem>
      </div>
      {paths.map((path) => (
        <div key={path} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <BreadcrumbItem>
            <Link to={path} className="text-sm font-medium text-muted-foreground hover:text-foreground ml-2">
              {pathToTitle[path] || path.split('/').pop()}
            </Link>
          </BreadcrumbItem>
        </div>
      ))}
    </Breadcrumb>
  );
}
