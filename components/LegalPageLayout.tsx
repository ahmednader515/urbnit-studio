type LegalPageLayoutProps = {
  title: string;
  body: string;
};

export function LegalPageLayout({ title, body }: LegalPageLayoutProps) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-neutral-900">{title}</h1>
        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-lg leading-relaxed text-neutral-600">
          {body}
        </div>
      </div>
    </section>
  );
}
