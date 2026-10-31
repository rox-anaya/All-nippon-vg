// Keeps the admin pages out of search engines.
export const metadata = {
  title: 'ANVG Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
