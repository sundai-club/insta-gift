export default function HiddenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="hidden-section">{children}</div>;
}
