import { useEffect, useRef } from "react";
import HeroSection from "../../components/landing/HeroSection";
import LandingFooter from "../../components/landing/LandingFooter";
import LandingHeader from "../../components/landing/LandingHeader";
import {
  AudienceSection,
  CaselSection,
  MissionSection,
  PrinciplesSection,
  FaqSection,
  StepsSection,
} from "../../components/landing/LandingSections";
import SignupBanner from "../../components/landing/SignupBanner";

// Landing page (trang chủ công khai)
function HomePage() {
  const emailRef = useRef(null);

  // Vào từ trang khác với #muc (vd. menu ở trang Chính sách) → cuộn tới mục đó sau khi trang vẽ xong
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, []);

  // Các nút CTA đăng ký đều đưa về ô nhập email ở banner cuối trang
  const focusSignup = () => {
    const input = emailRef.current;
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => input?.focus({ preventScroll: true }), 500);
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
        <AudienceSection onCta={focusSignup} />
        <FaqSection />
        <SignupBanner ref={emailRef} />
      </main>
      <LandingFooter />
    </div>
  );
}

export default HomePage;
