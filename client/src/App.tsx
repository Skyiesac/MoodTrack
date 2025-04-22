import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import JournalEntries from "@/pages/JournalEntries";
import NewJournal from "@/pages/NewJournal";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import SettingsPage from "@/pages/settings";
import { useUser } from "@/hooks/use-user";
import { UserAccountNav } from "@/components/ui/user-account-nav";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import "./styles/App.css";
import styles from "./styles/App.module.css";

function Router() {
  const { user, isLoading } = useUser();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <Loader2 className="absolute inset-0 h-24 w-24 animate-spin text-blue-600" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your journal...</p>
        </div>
      ) : !user ? (
        <AuthPage />
      ) : (
        <>
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link to="/">
                  <div className="flex items-center space-x-2 cursor-pointer group">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        SoulSync
                      </h1>
                      <p className="text-sm text-gray-500">
                        Your Daily Reflection Journal
                      </p>
                    </div>
                  </div>
                </Link>
                <UserAccountNav />
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav />
          </div>

          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<JournalEntries />} />
          <Route path="/new" element={<NewJournal />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    SoulSync &copy; {new Date().getFullYear()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Your trusted companion for emotional well-being
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
