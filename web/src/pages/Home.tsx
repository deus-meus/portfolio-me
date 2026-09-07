import React, { useEffect, useState } from 'react';
import { StatusBanner } from '../components/public/StatusBanner';
import { Header } from '../components/public/Header';
import { Hero } from '../components/public/Hero';
import { TechStack } from '../components/public/TechStack';
import { CaseStudies } from '../components/public/CaseStudies';
import { ExperienceSection } from '../components/public/Experience';
import { CredentialsSection } from '../components/public/Credentials';
import { ApiPlayground } from '../components/public/ApiPlayground';
import { Footer } from '../components/public/Footer';
import { api } from '../services/api';
import type { CaseStudy, Credential, Experience, Profile, Skill } from '../types';

interface HomeProps {
  onNavigateToAdmin?: () => void;
}

export const HomePage: React.FC<HomeProps> = ({ onNavigateToAdmin }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [skills, setSkills] = useState<Record<string, Skill[]>>({});
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [profData, csData, skillsData, expData, credData] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getCaseStudies().catch(() => []),
          api.getSkillsByCategory().catch(() => ({})),
          api.getExperiences().catch(() => []),
          api.getCredentials().catch(() => []),
        ]);

        if (profData) setProfile(profData);
        if (csData) setCaseStudies(csData);
        if (skillsData) setSkills(skillsData);
        if (expData) setExperiences(expData);
        if (credData) setCredentials(credData);
      } catch (err) {
        console.error('Error fetching initial portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-900 flex flex-col font-sans">
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-accent animate-pulse z-50"></div>
      )}
      <StatusBanner
        status={profile?.availability_status}
        location={profile?.location}
        noticePeriod={profile?.notice_period}
        email={profile?.email}
      />
      <Header
        fullName={profile?.full_name}
        roleTitle={profile?.role_title}
        resumeUrl={profile?.resume_url}
        onNavigateToAdmin={onNavigateToAdmin}
      />
      <main className="flex-1 w-full">
        <Hero profile={profile} />
        <TechStack skills={skills} />
        <CaseStudies caseStudies={caseStudies} />
        <ExperienceSection experiences={experiences} />
        <CredentialsSection credentials={credentials} />
        <ApiPlayground />
      </main>
      <Footer />
    </div>
  );
};
