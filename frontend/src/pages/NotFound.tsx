import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

export default function NotFound({ what = "page" }: { what?: string }) {
  useSeo("Not found");
  return (
    <div className="container-page py-28 text-center">
      <p className="meta">404</p>
      <h1 className="mt-3 text-h2 font-bold">That {what} doesn't exist</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The link may be old or mistyped. Try the home page or the project list.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn btn-primary">Go home</Link>
        <Link to="/projects" className="btn btn-ghost">View projects</Link>
      </div>
    </div>
  );
}
