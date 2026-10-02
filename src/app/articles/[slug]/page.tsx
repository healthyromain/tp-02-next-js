import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Article = {
  title: string;
  description: string;
  cover_image: string | null;
  published_at: string;
  body_html: string;
  tag_list: string[];
  user: {
    name: string;
    profile_image: string;
  };
};

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string): Promise<Article> {
  const response = await fetch(`https://dev.to/api/articles/${slug}`, {
    next: { revalidate: 300 },
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Impossible de charger cet article.");
  }

  return response.json();
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <Link className="font-semibold text-sky-700 hover:text-sky-900" href="/">
        ← Retour aux articles
      </Link>

      <article className="space-y-8">
        {article.cover_image ? (
          <Image
            className="h-auto max-h-112 w-full rounded-xl object-cover"
            src={article.cover_image}
            alt=""
            width={1200}
            height={630}
            priority
          />
        ) : null}

        <header className="space-y-4">
          <p className="text-sm text-slate-500">
            Publié le {new Date(article.published_at).toLocaleDateString("fr-FR")}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            {article.title}
          </h1>
          <p className="text-xl text-slate-600">{article.description}</p>
          <p className="text-sm text-slate-500">Par {article.user.name}</p>
          <div className="flex flex-wrap gap-2">
            {article.tag_list.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: article.body_html }}
        />
      </article>
    </main>
  );
}
