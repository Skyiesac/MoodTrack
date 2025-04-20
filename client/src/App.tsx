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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6b8aaf]" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#fefaf6]">
      <header className="border-b border-[#e4e2de] bg-[#fefaf6] p-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/">
            <div className="cursor-pointer">
              <h1 className="text-[#2d3748] text-3xl font-bold tracking-tight hover:text-[#6b8aaf] transition-colors">
                Mood Tracker
              </h1>
              <p className="mt-1 text-[#6b8aaf] text-sm font-medium">
                Track your daily emotions and reflections
              </p>
            </div>
          </Link>
          <UserAccountNav />
        </div>
      </header>
      <div className="container mx-auto">
        <BreadcrumbNav />
      </div>
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<JournalEntries />} />
          <Route path="/new" element={<NewJournal />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-[#e4e2de] py-8 text-[#6d6d6d] text-center">
        <div className="container mx-auto">
          <p className="text-sm">
            Mood Tracker &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
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
