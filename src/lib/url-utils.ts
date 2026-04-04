export const getHostname = (url: string | null): string => {
  if (!url) return "";
  try {
    return new URL(url).hostname || url;
  } catch {
    return url;
  }
};

export const getDomain = (url: string | null): string => {
  if (!url) return "";
  try {
    const hostname = new URL(url).hostname || "";
    return hostname.replace("www.", "");
  } catch {
    return url;
  }
};
