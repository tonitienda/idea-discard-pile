import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BsArrowLeft } from "react-icons/bs";

import IdeaFeed from "../../../components/IdeaFeed";
import CommentsSection from "../../../components/CommentsSection";
import HelpersList from "../../../components/HelpersList";
import { getComments, getHelpers, getIdeaBySlug } from "../../../backend/db";
import { useUser } from "../../hooks/use-user";
import { SITE_NAME } from "../../site";
import styles from "./idea.module.css";

type Props = { params: { slug: string } };

// Shared by generateMetadata and the page so the idea is fetched once.
const loadIdea = cache(async (slug: string, userId?: string) =>
  getIdeaBySlug(slug, userId)
);

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const idea = await loadIdea(params.slug);
  if (!idea) {
    return {};
  }

  const description = truncate(
    idea.teardown?.summary || idea.description || idea.title,
    160
  );
  const url = `/ideas/${idea.slug}`;

  return {
    title: idea.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: idea.title,
      description,
      siteName: SITE_NAME,
      publishedTime: idea.createdAt
        ? new Date(idea.createdAt).toISOString()
        : undefined,
    },
    twitter: { card: "summary", title: idea.title, description },
  };
}

export default async function IdeaPage({ params }: Props) {
  const user = await useUser();
  const idea = await loadIdea(params.slug, user?.id);
  if (!idea) {
    notFound();
  }

  const isOwner = user?.id === idea.owner.id;
  const [comments, helpers] = await Promise.all([
    getComments(idea.id),
    isOwner ? getHelpers(idea.id) : Promise.resolve([]),
  ]);
  const loginUrl = `/api/auth/login?returnTo=${encodeURIComponent(
    `/ideas/${idea.slug}#comments`
  )}`;

  return (
    <>
      <a href="/" className={styles.backLink}>
        <BsArrowLeft aria-hidden="true" /> All ideas
      </a>
      <IdeaFeed
        ideas={[idea]}
        variant="page"
        enableInteractions={!!user}
        viewerId={user?.id}
        openTeardownFor={idea.id}
      />
      {isOwner && <HelpersList helpers={helpers} />}
      <CommentsSection
        ideaId={idea.id}
        ideaOwnerId={idea.owner.id}
        initialComments={comments}
        viewerId={user?.id}
        loginUrl={loginUrl}
      />
      {!user && (
        <p className={styles.cta}>
          Have an idea you never built?{" "}
          <a href="/api/auth/login?screen_hint=signup">
            Share it and get an honest teardown
          </a>
          .
        </p>
      )}
    </>
  );
}
