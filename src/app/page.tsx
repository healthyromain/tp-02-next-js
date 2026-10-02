import Image from "next/image";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  readable_publish_date: string;
  slug: string;
  tag_list: string[];
};

type HomeProps = {
  searchParams: Promise<{ page?: string }>;
};

async function getArticles(page: number): Promise<Article[]> {
  const response = await fetch(
    `https://dev.to/api/articles?per_page=9&page=${page}`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
    throw new Error("Impossible de charger les articles.");
  }

  return response.json();
}

export default async function Home({ searchParams }: HomeProps) {
  const { page: pageParam } = await searchParams;
  const parsedPage = Number(pageParam);
  const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const articles = await getArticles(currentPage);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          Dev journal
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Les derniers articles
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Une sélection d&apos;articles techniques récupérés depuis dev.to.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Articles">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {article.cover_image ? (
              <Image
                className="h-44 w-full rounded-lg object-cover"
                src={article.cover_image}
                alt=""
                width={640}
                height={360}
              />
            ) : null}
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-500">{article.readable_publish_date}</p>
              <h2 className="text-xl font-semibold text-slate-950">
                <Link
                  className="transition-colors hover:text-sky-700"
                  href={`/articles/${article.slug}`}
                >
                  {article.title}
                </Link>
              </h2>
              <p className="line-clamp-3 text-slate-600">{article.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tag_list.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
      
      <nav className="flex items-center justify-between border-t border-slate-200 pt-6" aria-label="Pagination">
        {currentPage > 1 ? (
          <Link className="font-semibold text-sky-700 hover:text-sky-900" href={`/?page=${currentPage - 1}`}>
            ← Page précédente
          </Link>
        ) : (
          <span />
        )}
        <Link className="font-semibold text-sky-700 hover:text-sky-900" href={`/?page=${currentPage + 1}`}>
          Page suivante →
        </Link>
      </nav>
      
    </main>
  );
}
