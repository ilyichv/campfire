import { components } from "virtual:campfire/components";
import { layouts } from "virtual:campfire/layouts";
import { mdxComponents } from "virtual:campfire/mdx-components";
import type { SlideEntry } from "virtual:campfire/slides";
import { Component, type ReactNode } from "react";

/** User overrides in components/mdx.tsx win over discovered components. */
const slideComponents = { ...components, ...mdxComponents };

class SlideErrorBoundary extends Component<
  { slideId: string; children: ReactNode },
  { error?: Error }
> {
  state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="cf-slide-error">
          <h2>Failed to render {this.props.slideId}</h2>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SlideView({ slide }: { slide: SlideEntry }) {
  const layoutName = slide.layout ?? "default";
  const Layout = layouts[layoutName] ?? layouts.default;
  const Content = slide.Component;

  if (!Layout) {
    return (
      <div className="cf-slide-error">
        <h2>Missing layout "{layoutName}"</h2>
        <pre>
          Create layouts/{layoutName}.tsx or run: camp add {layoutName}
        </pre>
      </div>
    );
  }

  return (
    <SlideErrorBoundary key={slide.id} slideId={slide.id}>
      <Layout title={slide.title}>
        <Content components={slideComponents} />
      </Layout>
    </SlideErrorBoundary>
  );
}
