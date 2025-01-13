import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { Toaster } from 'sonner';
import { cn } from './lib/utils';
import ReactQueryProvider from './providers/react-query';
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from './providers/theme';
import './tailwind.css';
import { getThemeSession } from './utils/theme.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request);

  return {
    theme: themeSession.getTheme(),
  };
};

const Root = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useTheme();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang='en' className={cn(theme)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <NonFlashOfWrongThemeEls ssrTheme={false && Boolean(data.theme)} />
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
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <Root>{children}</Root>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}
