export default function QuoteCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role?: string;
}) {
  return (
    <figure className="flex max-w-4xl flex-col gap-8">
      <blockquote className="font-medium text-5xl leading-snug tracking-tight">
        “{quote}”
      </blockquote>
      <figcaption className="flex items-baseline gap-3 text-xl">
        <span className="font-semibold">{author}</span>
        {role ? <span className="opacity-60">{role}</span> : null}
      </figcaption>
    </figure>
  );
}
