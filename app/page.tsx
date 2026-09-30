import Portfolio from "@/components/portfolio";
import { portfolio } from "@/data/portfolio";
import { personSchema } from "@/lib/seo";
export default function Home() {
  const person = personSchema(portfolio.profile, portfolio.social);
  return (
    <>
      {person && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Portfolio />
    </>
  );
}
