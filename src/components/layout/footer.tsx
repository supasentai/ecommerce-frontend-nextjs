export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Ecommerce</span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
