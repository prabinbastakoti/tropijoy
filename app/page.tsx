import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import BundleBanner from "@/components/home/BundleBanner";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import UsageIdeas from "@/components/home/UsageIdeas";
import Testimonials from "@/components/home/Testimonials";
import NewsletterBanner from "@/components/home/NewsletterBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <BundleBanner />
      <ProcessTimeline />
      <UsageIdeas />
      <Testimonials />
      <NewsletterBanner />
    </>
  );
}
