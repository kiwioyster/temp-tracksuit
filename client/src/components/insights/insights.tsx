import { Trash2Icon } from 'lucide-react';
import { cx } from '../../lib/cx.ts';
import styles from './insights.module.css';
import type { Insight } from '../../../../shared/schemas/insight.ts';

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onRefresh?: () => void;
};

export const Insights = ({ insights, className, onRefresh }: InsightsProps) => {
  const deleteInsight = async (id: number) => {
    console.log('deleteInsight', id);

    try {
      const response = await fetch(`/api/insights/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete insight');
      }

      onRefresh?.();
    } catch (error) {
      console.error('Failed to delete insight:', error);
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length ? (
          insights.map(({ id, text, createdAt, brand }) => (
            <div className={styles.insight} key={id}>
              <div className={styles['insight-meta']}>
                <span>{brand}</span>
                <div className={styles['insight-meta-details']}>
                  <span>{createdAt.toString()}</span>
                  <button onClick={() => deleteInsight(id)}>
                    <Trash2Icon className={styles['insight-delete']} />
                  </button>
                </div>
              </div>
              <p className={styles['insight-content']}>{text}</p>
            </div>
          ))
        ) : (
          <p>We have no insight!</p>
        )}
      </div>
    </div>
  );
};
