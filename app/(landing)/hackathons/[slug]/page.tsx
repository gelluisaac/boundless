import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHackathon } from '@/lib/api/hackathon';
import { generateHackathonMetadata } from '@/lib/metadata';
import { HackathonDataProvider } from '@/lib/providers/hackathonProvider';
import HackathonPageClient from './HackathonPageClient';

interface HackathonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: HackathonPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await getHackathon(slug);

    if (!response.success || !response.data) {
      return {
        title: 'Hackathon Not Found | Boundless',
        description: 'The requested hackathon could not be found.',
      };
    }

    return generateHackathonMetadata(response.data);
  } catch {
    return {
      title: 'Hackathon | Boundless',
      description: 'Join exciting hackathons on Boundless.',
    };
  }
}

export default async function HackathonPage({ params }: HackathonPageProps) {
  const { slug } = await params;
  try {
    const response = await getHackathon(slug);

    if (!response.success || !response.data) {
      notFound();
    }

    return (
      <HackathonDataProvider hackathonSlug={slug}>
        <HackathonPageClient />
      </HackathonDataProvider>
    );
  } catch {
    notFound();
  }
}
