export function resolveLogoUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;

  if (raw.includes("img.logo.dev")) {
    try {
      const url = new URL(raw);
      const domain = url.pathname.slice(1);
      if (!token) return raw;
      return `https://img.logo.dev/${domain}?token=${token}&size=200&format=png`;
    } catch {
      return raw;
    }
  }

  if (token && raw.startsWith("logodev:")) {
    const domain = raw.slice(8);
    return `https://img.logo.dev/${domain}?token=${token}&size=200&format=png`;
  }

  return raw;
}
