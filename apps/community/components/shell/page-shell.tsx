import { Header } from "./header";
import { Footer } from "./footer";

/**
 * Member-facing page frame: sticky header, centered content column, footer.
 * Ported from the community design reference (Header/Footer + Page wrapper).
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-0">
      <Header />
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
