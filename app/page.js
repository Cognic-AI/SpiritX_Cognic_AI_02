import Header from './_components/Header';
import Hero from './_components/Hero';
import CategorySearch from './_components/CategorySearch';
import Features from './_components/Features';
import Footer from './_components/Footer';
import HomeWrapper from './HomeWrapper';

export default function Home() {
  const homePage = (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CategorySearch />
      </main>
      <Footer />
    </div>
  );

  return (
    <HomeWrapper>
      {homePage}
    </HomeWrapper>
  );
}
