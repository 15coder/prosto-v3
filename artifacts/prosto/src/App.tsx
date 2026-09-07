import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import MenuPage from '@/pages/MenuPage';
import CheckoutPage from '@/pages/CheckoutPage';
import InstallPage from '@/pages/InstallPage';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/install" component={InstallPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.classList.add('dark');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
        <PWAInstallBanner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
