import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { cn } from './lib/utils';
import ReactQueryProvider from './providers/react-query';
import {
  NonFlashOfWrongThemeEls,
  Theme,
  ThemeProvider,
  useTheme,
} from './providers/theme';
import './tailwind.css';

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const themeSession = await getThemeSession(request);

//   return {
//     theme: themeSession.getTheme(),
//   };
// };

const Root = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useTheme();

  useEffect(() => {
    const html = document.querySelector('html');
    if (!html) return;
    window.toggleTheme = () => {
      if (html?.classList.contains('dark')) {
        html.classList.remove('dark');
      } else {
        html?.classList.add('dark');
      }
    };
  }, []);

  return (
    <html lang='en' className={cn(theme)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <NonFlashOfWrongThemeEls ssrTheme={false} />
        <Meta />
        <Links />
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  // const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={Theme.DARK}>
      <Root>{children}</Root>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}
