import { createCookieSessionStorage } from '@remix-run/node';
import { isTheme, Theme } from '~/providers/theme';

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'theme',
    secure: true,
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    domain: process.env.BASE_DOMAIN,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
