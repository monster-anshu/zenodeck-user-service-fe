export const createURLObject = (url?: string | URL | null) => {
  if (!url) {
    return null;
  }
  try {
    const obj = new URL(url);
    return obj;
  } catch (error) {
    return null;
  }
};

export const redirectWindow = (url: URL | string, wait = false) => {
  window.location.href = url.toString();
  if (wait) {
    return new Promise(() => {});
  }
};
