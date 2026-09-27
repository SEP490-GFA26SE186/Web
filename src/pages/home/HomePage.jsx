import { useRef } from "react";
import HeroSection from "../../components/landing/HeroSection";
import LandingFooter from "../../components/landing/LandingFooter";
import LandingHeader from "../../components/landing/LandingHeader";
import {
  AudienceSection,
  CaselSection,
  MissionSection,
  PrinciplesSection,
  StepsSection,
  TestimonialsSection,
} from "../../components/landing/LandingSections";
import SignupBanner from "../../components/landing/SignupBanner";
import { toast } from "../../stores/toastStore";

// Landing page (trang chủ công khai)
function HomePage() {
  const emailRef = useRef(null);

  // Các nút CTA đăng ký đều đưa về ô nhập email ở banner cuối trang
  const focusSignup = () => {
    const input = emailRef.current;
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => input?.focus({ preventScroll: true }), 500);
  };

  const handleAudienceCta = (audience) => {
    if (audience.to === "contact") {
      toast.info("Đội ngũ StoryWeaver sẽ liên hệ trường học trong 24h — form liên hệ sẽ có ở bản sau");
      return;
    }
    focusSignup();
  };

  return (
    <div className="min-h-screen bg-canvas">
      <LandingHeader />
      <main className="flex w-full flex-col overflow-hidden pt-20">
        <HeroSection onSignupClick={focusSignup} />
        <MissionSection />
        <PrinciplesSection />
        <CaselSection />
        <StepsSection />
        <AudienceSection onCta={handleAudienceCta} />
        <TestimonialsSection />
        <SignupBanner ref={emailRef} />
      </main>
      <LandingFooter />
    </div>
  );
}

export default HomePage;
