import styled, { keyframes } from 'styled-components';

// ─── Shimmer animation ────────────────────────────────────────────────────────

const shimmer = keyframes`
  -100% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

// ─── Base skeleton styling ────────────────────────────────────────────────────

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.backgroundCard} 0%,
    ${({ theme }) => theme.borderCard} 50%,
    ${({ theme }) => theme.backgroundCard} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

// ─── Specific skeleton types ──────────────────────────────────────────────────

export const SkeletonText = styled(SkeletonBase)`
  height: 1rem;
  width: 100%;

  &.short {
    width: 60%;
  }

  &.medium {
    width: 80%;
  }
`;

export const SkeletonTitle = styled(SkeletonBase)`
  height: 1.75rem;
  width: 70%;
  margin-bottom: 0.5rem;
`;

export const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
`;

export const SkeletonCard = styled(SkeletonBase)`
  border-radius: 20px;
  overflow: hidden;
`;

export const SkeletonBadge = styled(SkeletonBase)`
  height: 0.875rem;
  width: 120px;
  margin: 0 auto 1rem;
  border-radius: 20px;
`;

export const SkeletonTag = styled(SkeletonBase)`
  height: 0.6875rem;
  width: 80px;
  border-radius: 8px;
  display: inline-block;

  &:not(:last-child) {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

// ─── Skeleton Card Layout ─────────────────────────────────────────────────────

export const ProjectCardSkeleton = styled.div`
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundCard};
`;

export const ProjectCardImageSkeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.borderCard} 0%,
    ${({ theme }) => theme.backgroundCard} 50%,
    ${({ theme }) => theme.borderCard} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  width: 100%;
  aspect-ratio: 16 / 10;
`;

export const ProjectCardBodySkeleton = styled.div`
  padding: 1.5rem;
`;

export const ProjectCardTitleSkeleton = styled(SkeletonTitle)`
  width: 85%;
  height: 1.25rem;
  margin-bottom: 0.75rem;
`;

export const ProjectCardDescSkeleton = styled.div`
  margin-bottom: 1rem;

  ${SkeletonText} {
    margin-bottom: 0.5rem;

    &:last-child {
      width: 95%;
    }
  }
`;

export const ProjectCardTagsSkeleton = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// ─── Experience Skeleton ───────────────────────────────────────────────────────

export const ExperienceSkeleton = styled.div`
  display: flex;
  gap: 1.25rem;
  padding-bottom: 2.5rem;

  @media (min-width: 640px) {
    gap: 1.75rem;
  }
`;

export const ExperienceDotSkeleton = styled(SkeletonBase)`
  width: 58px;
  height: 58px;
  border-radius: 16px;
  flex-shrink: 0;
`;

export const ExperienceCardSkeleton = styled(SkeletonBase)`
  flex: 1;
  border-radius: 20px;
  padding: 1.5rem;
  min-height: 200px;
`;

// ─── Skills Skeleton ───────────────────────────────────────────────────────────

export const SkillSkeleton = styled(SkeletonBase)`
  height: 2rem;
  border-radius: 10px;
`;

export const SkillCategoryHeaderSkeleton = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundCard};
  padding: 1.75rem;
  min-height: 290px;
`;

export const SkillCategoryTitleSkeleton = styled(SkeletonTitle)`
  width: 72%;
  height: 1.1rem;
  margin: 0 auto 1.25rem;
`;

export const SkillIconSkeleton = styled(SkeletonBase)`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  margin: 0 auto 1rem;
`;

export const SkillDividerSkeleton = styled(SkeletonBase)`
  height: 1px;
  width: 92%;
  margin: 0 auto 1.25rem;
  border-radius: 999px;
`;

export const SkillTagsSkeleton = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

// ─── About Skeleton ───────────────────────────────────────────────────────────

export const AboutSkeleton = styled.div`
  display: grid;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 3fr;
    gap: 3.5rem;
  }
`;

export const AboutImageSkeleton = styled(SkeletonBase)`
  aspect-ratio: 1;
  border-radius: 16px;
  width: 100%;
`;

export const AboutContentSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// ─── Contact Skeleton ───────────────────────────────────────────────────────────

export const ContactInputSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 2.9rem;
  border-radius: 12px;
`;

export const ContactLabelSkeleton = styled(SkeletonBase)`
  width: 90px;
  height: 0.85rem;
  border-radius: 8px;
`;

export const ContactButtonSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 3.05rem;
  border-radius: 14px;
`;

export const ContactInfoSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 3.9rem;
  border-radius: 16px;
  padding: 0.5rem 0.7rem;
`;

export const ContactInfoWrapSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
`;

export const ContactInfoIconSkeleton = styled(SkeletonBase)`
  width: 46px;
  height: 46px;
  border-radius: 13px;
  flex-shrink: 0;
`;

export const ContactInfoTextSkeleton = styled.div`
  flex: 1;
  display: grid;
  gap: 0.45rem;
`;

export const ContactFormSkeleton = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundCard};
  padding: 2.5rem;
  min-height: 520px;
`;

export const ContactFormRowSkeleton = styled.div`
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ContactFieldSkeleton = styled.div`
  display: grid;
  gap: 0.45rem;
`;

export const ContactInfoColumnSkeleton = styled.div`
  display: grid;
  gap: 16px;
`;

export const ContactInfoTitleSkeleton = styled(SkeletonTitle)`
  width: 58%;
  height: 1.6rem;
  margin: 0 0 0.55rem;
`;

export const ContactInfoDescSkeleton = styled.div`
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1.25rem;

  ${SkeletonText} {
    height: 0.92rem;
  }
`;

export const ContactWhatsAppSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 3.05rem;
  border-radius: 12px;
`;

// ─── Hero Skeleton ────────────────────────────────────────────────────────────

export const HeroSkeleton = styled.div`
  display: grid;
  align-items: center;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }
`;

export const HeroSkeletonLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeroSkeletonButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-top: 0.75rem;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

export const HeroSkeletonSocial = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const HeroSkeletonRight = styled.div`
  display: flex;
  justify-content: center;
`;

export const HeroSkeletonAvatar = styled(SkeletonBase)`
  width: 270px;
  height: 270px;
  border-radius: 50%;

  @media (min-width: 1024px) {
    width: 320px;
    height: 320px;
  }
`;

// ─── Utility component ────────────────────────────────────────────────────────

interface ProjectSkeletonLayoutProps {
  count?: number;
}

export function ProjectSkeletonLayout({ count = 3 }: ProjectSkeletonLayoutProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i}>
          <ProjectCardImageSkeleton />
          <ProjectCardBodySkeleton>
            <ProjectCardTitleSkeleton />
            <ProjectCardDescSkeleton>
              <SkeletonText />
              <SkeletonText className="short" />
            </ProjectCardDescSkeleton>
            <ProjectCardTagsSkeleton>
              <SkeletonTag />
              <SkeletonTag />
              <SkeletonTag />
            </ProjectCardTagsSkeleton>
          </ProjectCardBodySkeleton>
        </ProjectCardSkeleton>
      ))}
    </>
  );
}

interface ExperienceSkeletonLayoutProps {
  count?: number;
}

export function ExperienceSkeletonLayout({
  count = 4,
}: ExperienceSkeletonLayoutProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ExperienceSkeleton key={i}>
          <ExperienceDotSkeleton />
          <ExperienceCardSkeleton />
        </ExperienceSkeleton>
      ))}
    </>
  );
}

interface SkillsSkeletonLayoutProps {
  count?: number;
}

export function SkillsSkeletonLayout({ count = 4 }: SkillsSkeletonLayoutProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkillCategoryHeaderSkeleton key={i}>
          <SkillIconSkeleton />
          <SkillCategoryTitleSkeleton />
          <SkillDividerSkeleton />
          <SkillTagsSkeleton>
            {Array.from({ length: 7 }).map((_, j) => (
              <SkillSkeleton
                key={j}
                style={{ width: j % 3 === 0 ? "96px" : j % 2 === 0 ? "84px" : "74px" }}
              />
            ))}
          </SkillTagsSkeleton>
        </SkillCategoryHeaderSkeleton>
      ))}
    </>
  );
}

interface AboutSkeletonLayoutProps {
  hasImage?: boolean;
}

export function AboutSkeletonLayout({ hasImage = true }: AboutSkeletonLayoutProps) {
  return (
    <AboutSkeleton>
      {hasImage && <AboutImageSkeleton />}
      <AboutContentSkeleton>
        <SkeletonTitle style={{ width: '60%' }} />
        <SkeletonText />
        <SkeletonText />
        <SkeletonText style={{ width: '80%' }} />
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} style={{ height: '100px' }} />
          ))}
        </div>
      </AboutContentSkeleton>
    </AboutSkeleton>
  );
}

interface ContactSkeletonLayoutProps {
  includeInfo?: boolean;
}

export function ContactSkeletonLayout({ includeInfo = true }: ContactSkeletonLayoutProps) {
  return (
    <>
      {includeInfo && (
        <ContactInfoColumnSkeleton>
          <ContactInfoTitleSkeleton />
          <ContactInfoDescSkeleton>
            <SkeletonText />
            <SkeletonText className="medium" />
          </ContactInfoDescSkeleton>
          {Array.from({ length: 3 }).map((_, i) => (
            <ContactInfoSkeleton key={i}>
              <ContactInfoWrapSkeleton>
                <ContactInfoIconSkeleton />
                <ContactInfoTextSkeleton>
                  <SkeletonText style={{ width: "35%", height: "0.7rem" }} />
                  <SkeletonText style={{ width: "62%", height: "0.95rem" }} />
                </ContactInfoTextSkeleton>
              </ContactInfoWrapSkeleton>
            </ContactInfoSkeleton>
          ))}
          <ContactWhatsAppSkeleton />
        </ContactInfoColumnSkeleton>
      )}
      <ContactFormSkeleton>
        <ContactFormRowSkeleton>
          <ContactFieldSkeleton>
            <ContactLabelSkeleton />
            <ContactInputSkeleton />
          </ContactFieldSkeleton>
          <ContactFieldSkeleton>
            <ContactLabelSkeleton />
            <ContactInputSkeleton />
          </ContactFieldSkeleton>
        </ContactFormRowSkeleton>
        <ContactFieldSkeleton style={{ marginBottom: "1.25rem" }}>
          <ContactLabelSkeleton />
          <ContactInputSkeleton />
        </ContactFieldSkeleton>
        <ContactFieldSkeleton style={{ marginBottom: "1.25rem" }}>
          <ContactLabelSkeleton />
          <ContactInputSkeleton style={{ height: "8.2rem" }} />
        </ContactFieldSkeleton>
        <ContactButtonSkeleton />
      </ContactFormSkeleton>
    </>
  );
}

export function HeroSkeletonLayout() {
  return (
    <HeroSkeleton>
      <HeroSkeletonLeft>
        <SkeletonBadge style={{ margin: '0 0 0.5rem 0', width: '170px' }} />
        <SkeletonTitle style={{ width: '75%', height: '3.2rem', marginBottom: 0 }} />
        <SkeletonTitle style={{ width: '55%', height: '3.2rem', marginBottom: 0.25 }} />
        <SkeletonText className="medium" />
        <SkeletonText />
        <SkeletonText className="short" />
        <HeroSkeletonButtons>
          <SkeletonBase style={{ height: '46px', width: '170px', borderRadius: '12px' }} />
          <SkeletonBase style={{ height: '46px', width: '170px', borderRadius: '12px' }} />
        </HeroSkeletonButtons>
        <HeroSkeletonSocial>
          <SkeletonBase style={{ width: '46px', height: '46px', borderRadius: '12px' }} />
          <SkeletonBase style={{ width: '46px', height: '46px', borderRadius: '12px' }} />
          <SkeletonBase style={{ width: '46px', height: '46px', borderRadius: '12px' }} />
        </HeroSkeletonSocial>
      </HeroSkeletonLeft>

      <HeroSkeletonRight>
        <HeroSkeletonAvatar />
      </HeroSkeletonRight>
    </HeroSkeleton>
  );
}
