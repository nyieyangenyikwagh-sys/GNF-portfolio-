import { portfolio as p } from "@/data/portfolio";
import { Brand, LabelBadge } from "./casebook-primitives";
export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-top">
        <Brand
          name={p.profile.name}
          title={p.ui.footer.title}
          backToTop={p.ui.backToTop}
        />
        <div>
          <p>{p.ui.footer.privacy}</p>
          <LabelBadge label={p.profile.label} labels={p.labels} />
        </div>
        <div className="footer-links">
          <div>
            <span>{p.ui.footer.navigate}</span>
            {p.navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.title}
              </a>
            ))}
          </div>
          {p.social.filter((item) => item.url).length > 0 && (
            <div>
              <span>{p.ui.footer.elsewhere}</span>
              {p.social
                .filter((item) => item.url)
                .map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>{p.ui.footer.copyright}</span>
        <span>{p.ui.footer.title}</span>
        <a href="#top">{p.ui.backToTop} ↑</a>
      </div>
    </footer>
  );
}
