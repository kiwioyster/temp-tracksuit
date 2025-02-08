import { useEffect, useState } from 'react';
import { Header } from '../components/header/header.tsx';
import { Insights } from '../components/insights/insights.tsx';
import styles from './app.module.css';
import type { Insight } from '../../../shared/schemas/insight.ts';

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  const fetchInsights = async () => {
    const response = await fetch('/api/insights');
    const data = await response.json();
    setInsights(data);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header onInsightAdded={fetchInsights} />
      <Insights
        className={styles.insights}
        insights={insights}
        onRefresh={fetchInsights}
      />
    </main>
  );
};

// Interview note - not sure why app tsx is under routes.
// ran out of time to add tests for the app.tsx
