import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://github.com/minopacom/minopamotion"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Frame-Based Rendering',
    description:
      'Every video is a pure function of the current frame. Components render deterministically, making videos predictable and testable.',
  },
  {
    title: 'React Components',
    description:
      'Use the React component model you already know. Compose videos from reusable components with props, state, and hooks.',
  },
  {
    title: 'Multiple Renderers',
    description:
      'Preview in the browser with the Player, render server-side with FFmpeg, or encode client-side with WebCodecs.',
  },
];

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map(({ title, description }) => (
            <div className={clsx('col col--4', styles.featureCard)} key={title}>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
