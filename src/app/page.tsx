import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary">
      <Navbar />
      <Hero />
      <section className="py-20 text-center">
        <h3 className="text-2xl font-serif text-primary">More Sections Coming Soon...</h3>
      </section>
    </main>
  );
}
